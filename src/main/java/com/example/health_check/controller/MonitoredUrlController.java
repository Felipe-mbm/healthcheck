package com.example.health_check.controller;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.dto.UrlStatisticsDto;
import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.UrlStatistics;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.UrlStatisticsRepository;
import com.example.health_check.service.HealthCheckService;
import com.example.health_check.service.MonitoredUrlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static org.apache.catalina.manager.StatusTransformer.formatSeconds;

@RestController
@RequestMapping("/urls")
public class MonitoredUrlController {

    private final MonitoredUrlService service;
    private final HealthCheckService healthCheckService;
    private final UrlStatisticsRepository urlStatisticsRepository;
    private final MonitoredUrlRepository urlRepository; // Adicionado: campo necessário para o findById

    // Construtor atualizado: Injetando todos os componentes necessários
    public MonitoredUrlController(MonitoredUrlService service,
                                  HealthCheckService healthCheckService,
                                  UrlStatisticsRepository urlStatisticsRepository,
                                  MonitoredUrlRepository urlRepository) {
        this.service = service;
        this.healthCheckService = healthCheckService;
        this.urlStatisticsRepository = urlStatisticsRepository;
        this.urlRepository = urlRepository;
    }

    @PostMapping
    public ResponseEntity<MonitoredUrlDto.Response> register(@RequestBody MonitoredUrlDto.CreateRequest request) {
        MonitoredUrlDto.Response newUrl = service.register(request);

        return ResponseEntity
                .created(URI.create("/urls/" + newUrl.id()))
                .body(newUrl);
    }

    @GetMapping
    public ResponseEntity<List<MonitoredUrlDto.Response>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<UrlStatisticsDto> getStats(@PathVariable String id) {
        MonitoredUrl url = urlRepository.findById(id).orElseThrow();

        UrlStatistics stats = urlStatisticsRepository.findByMonitoredUrl(url)
                .orElseGet(() -> {
                    UrlStatistics newStats = new UrlStatistics();
                    newStats.setMonitoredUrl(url);
                    return newStats;
                });

        // Criamos o DTO com o tempo formatado
        UrlStatisticsDto response = new UrlStatisticsDto(
                url.getId(),
                url.getName(),
                stats.getTotalOutages(),
                stats.getTotalDowntimeSeconds(),
                formatSeconds(stats.getTotalDowntimeSeconds()) // Chama a formatação
        );

        return ResponseEntity.ok(response);
    }
    private String formatSeconds(long totalSeconds) {
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }}