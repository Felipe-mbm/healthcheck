package com.example.health_check.service;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.dto.UrlStatisticsDto;
import com.example.health_check.exception.BusinessError;
import com.example.health_check.exception.BusinessException;
import com.example.health_check.mapper.MonitoredUrlMapper;
import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage;
import com.example.health_check.model.entity.UrlStatistics;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.UrlStatisticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MonitoredUrlService {

    private final UrlStatisticsRepository statisticsRepository;
    private final MonitoredUrlRepository repository;
    private final MonitoredUrlMapper mapper;

    public MonitoredUrlService(UrlStatisticsRepository statisticsRepository, MonitoredUrlRepository repository, MonitoredUrlMapper mapper) {
        this.statisticsRepository = statisticsRepository;
        this.repository = repository;
        this.mapper = mapper;
    }

    public MonitoredUrlDto.Response register(MonitoredUrlDto.CreateRequest request) {
        if (repository.existsByUrl(request.url())) {
            throw new BusinessException(BusinessError.URL_ALREADY_REGISTERED);
        }

        MonitoredUrl entity = mapper.toEntity(request);
        MonitoredUrl savedEntity = repository.save(entity);

        return mapper.toResponse(savedEntity, calculateDowntime(savedEntity));
    }

    public List<MonitoredUrlDto.Response> findAll() {
        return repository.findAll()
                .stream()
                .map(entity -> mapper.toResponse(entity, calculateDowntime(entity)))
                .toList();
    }

    public UrlStatisticsDto getStatistics(String id) {
        MonitoredUrl url = repository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessError.URL_NOT_FOUND));

        UrlStatistics stats = statisticsRepository.findByMonitoredUrl(url)
                .orElseGet(() -> {
                    UrlStatistics newStats = new UrlStatistics();
                    newStats.setMonitoredUrl(url);
                    newStats.setTotalOutages(0);
                    newStats.setTotalDowntimeSeconds(0L);
                    return newStats;
                });

        return new UrlStatisticsDto(
                url.getId(),
                url.getName(),
                stats.getTotalOutages(),
                stats.getTotalDowntimeSeconds(),
                formatSeconds(stats.getTotalDowntimeSeconds())
        );
    }

    public void delete(String id) {
        if (!repository.existsById(id))
            throw new BusinessException(BusinessError.URL_NOT_FOUND);
        repository.deleteById(id);
    }

    private long calculateDowntime(MonitoredUrl entity) {
        if (entity.getOutages() == null) {
            return 0;
        }

        LocalDateTime limit = LocalDateTime.now().minusHours(24);

        return entity.getOutages().stream()
                .filter(outage -> outage.getStartTime().isAfter(limit))
                .mapToLong(Outage::getDurationInMinutes)
                .sum();
    }

    private String formatSeconds(long totalSeconds) {
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    public void update(String id, MonitoredUrlDto.UpdateRequest request) {
        MonitoredUrl entity = repository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessError.URL_NOT_FOUND));

        if(request.name() != null ) entity.setName(request.name());
        if(request.url() != null) entity.setUrl(request.url());
        if(request.isActive() != null) entity.setIsActive(request.isActive());

        repository.save(entity);
    }
}