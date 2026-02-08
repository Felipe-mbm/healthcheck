package com.example.health_check.scheduler;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.service.HealthCheckService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UrlCheckScheduler {

    private final MonitoredUrlRepository urlRepository;
    private final HealthCheckService healthCheckService;

    public UrlCheckScheduler(MonitoredUrlRepository urlRepository, HealthCheckService healthCheckService) {
        this.urlRepository = urlRepository;
        this.healthCheckService = healthCheckService;
    }

    // Alterado: removido fixedRate fixo e adicionado fixedRateString apontando para a propriedade
    @Scheduled(fixedRateString = "${app.scheduler.interval}")
    public void checkSystemAutomatically() {
        System.out.println("Starting verification...");

        try {
            List<MonitoredUrl> urls = urlRepository.findAll();

            if (urls.isEmpty()) {
                System.out.println("No URLs registered to check");
                return;
            }

            urls.parallelStream().forEach(url -> {
                if (Boolean.TRUE.equals(url.getIsActive())) {
                    healthCheckService.checkUrl(url);
                }
            });

            System.out.println("Verification completed for " + urls.size() + " sites");
        } catch (Exception e) {
            System.out.println("Critical scheduler failure: " + e.getMessage());
            e.printStackTrace();
        }
    }
}