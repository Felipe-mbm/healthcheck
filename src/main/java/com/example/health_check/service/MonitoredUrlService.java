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

    public MonitoredUrlDto.Response register(MonitoredUrlDto.CreatRequest request) {

        if (repository.existsByUrl(request.url())) {
            throw new RuntimeException("URL já cadastrada no sistema!");
        }

        MonitoredUrl entidade = mapper.toEntity(request);
        MonitoredUrl salva = repository.save(entidade);

        return mapper.toResponse(salva);
    }

    public List<MonitoredUrlDto.Response> listarTodas() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}
