package com.example.health_check.service;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.mapper.MonitoredUrlMapper;
import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.repository.MonitoredUrlRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MonitoredUrlService {

    private final MonitoredUrlRepository repository;
    private final MonitoredUrlMapper mapper;

    public MonitoredUrlService(MonitoredUrlRepository repository, MonitoredUrlMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public MonitoredUrlDto.Response register(MonitoredUrlDto.CreateRequest request) {

        if (repository.existsByUrl(request.url())) {
            throw new RuntimeException("URL already registered in the system!");
        }

        MonitoredUrl entity = mapper.toEntity(request);
        MonitoredUrl savedEntity = repository.save(entity);

        return mapper.toResponse(savedEntity);
    }

    public List<MonitoredUrlDto.Response> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public void delete(String id) {
        if (!repository.existsById(id))
            throw new RuntimeException("Not found URL");
        repository.deleteById(id);
    }
}