package com.example.health_check.scheduler;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.service.HealthCheckService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component
public class UrlCheckScheduler {

    private final MonitoredUrlRepository urlRepository;
    private final HealthCheckService healthCheckService;

    public UrlCheckScheduler(MonitoredUrlRepository urlRepository, HealthCheckService healthCheckService) {
        this.urlRepository = urlRepository;
        this.healthCheckService = healthCheckService;
    }

    @Scheduled(fixedRateString = "${app.scheduler.interval}")
    public void checkSystemAutomatically() {
        log.info("Starting verification...");

        try {
            List<MonitoredUrl> urls = urlRepository.findAll();

            if (urls.isEmpty()) {
                log.warn("No URLs registered to check");
                return;
            }

            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                urls.stream()
                        .filter(url -> Boolean.TRUE.equals(url.getIsActive()))
                        .forEach(url -> executor.submit(() -> {
                            try {
                                int randomDelay = new java.util.Random().nextInt(10000);
                                Thread.sleep(randomDelay);
                            } catch (InterruptedException e) {
                                Thread.currentThread().interrupt();
                            }
                            healthCheckService.checkUrl(url);
                        }));
            }

            log.info("Verification completed for {} sites", urls.size());
        } catch (Exception e) {
            log.error("Critical scheduler failure: " + e.getMessage());
        }
    }
}