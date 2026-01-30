package com.example.health_check.scheduler;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.UserRepository;
import com.example.health_check.service.HealthCheckService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UrlCheckScheduler {

    private final MonitoredUrlRepository urlRepository;
    private final UserRepository userRepository;
    private final HealthCheckService healthCheckService;

    private final String SYSTEM_USER_ID = "1";

    public UrlCheckScheduler(MonitoredUrlRepository urlRepository, UserRepository userRepository, HealthCheckService healthCheckService) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
        this.healthCheckService = healthCheckService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkSystemAutomatically() {
        System.out.println("Starting verification...");

        try {
            User systemUser = userRepository.findById(SYSTEM_USER_ID)
                    .orElseThrow(() -> new RuntimeException("System user not found for logging!"));

            List<MonitoredUrl> urls = urlRepository.findAll();

            if (urls.isEmpty()) {
                System.out.println("No URLs registered to check");
                return;
            }

            urls.parallelStream().forEach(url -> {
                if (Boolean.TRUE.equals(url.getIsActive())) {
                    healthCheckService.checkUrl(url, systemUser);
                }
            });

            System.out.println("Verification completed for " + urls.size() + " sites");
        } catch (Exception e) {
            System.out.println("Critical scheduler failure: " + e.getMessage());
            e.printStackTrace();
        }
    }
}