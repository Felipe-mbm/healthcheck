package com.example.health_check.scheduler;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.UserRepository;
import com.example.health_check.service.HealthCheckService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Component
public class UrlCheckScheduler {
    private static final Logger logger = LoggerFactory.getLogger(UrlCheckScheduler.class);

    private static final String SYSTEM_USER_ID = "7da2266a-eb49-4ae6-aa33-05529db2e99b";
    private final MonitoredUrlRepository urlRepository;
    private final HealthCheckService healthCheckService;

    public UrlCheckScheduler(MonitoredUrlRepository urlRepository, HealthCheckService healthCheckService) {
        this.urlRepository = urlRepository;
        this.healthCheckService = healthCheckService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkSystemAutomatically() {
        logger.info("Starting verification...");

        List<MonitoredUrl> urls = urlRepository.findAll();

        if (urls.isEmpty()) {
            logger.info("No URLs registered to check");
            return;
        }

        urls.forEach(url -> { // Use forEach simples para facilitar o controle de variáveis
            if (Boolean.TRUE.equals(url.getIsActive())) {
                long startTime = System.currentTimeMillis(); // Inicia para cada URL

                try {
                    healthCheckService.checkUrl(url);

                    long duration = System.currentTimeMillis() - startTime;
                    url.setResponseTimeMs(duration); // Agora a variável 'url' está visível aqui!
                    logger.info("Site {} verificado em {}ms - Status: UP", url.getName(), duration);

                } catch (Exception e) {
                    logger.error("Critical failure for {}: {}", url.getName(), e.getMessage());
                    url.setLastStatus("DOWN");
                    url.setResponseTimeMs(null);
                }

                // O save e o tempo devem estar DENTRO do loop do forEach
                url.setLastCheckedAt(LocalDateTime.now());
                urlRepository.save(url); // Use 'urlRepository', que é o nome que você definiu acima
            }
        });

        logger.info("Verification completed for {} sites", urls.size());
    }
}