package com.example.health_check.service;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage;
import com.example.health_check.model.entity.UrlStatistics;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.OutageRepository;
import com.example.health_check.repository.UrlStatisticsRepository;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class HealthCheckService {

    private final MonitoredUrlRepository urlRepository;
    private final OutageRepository outageRepository;
    private final UrlStatisticsRepository urlStatisticsRepository;
    private final WebClient webClient;

    public HealthCheckService(MonitoredUrlRepository urlRepository, OutageRepository outageRepository, UrlStatisticsRepository urlStatisticsRepository, WebClient webClient) {
        this.urlRepository = urlRepository;
        this.outageRepository = outageRepository;
        this.urlStatisticsRepository = urlStatisticsRepository;
        this.webClient = webClient;
    }

    public void checkUrl(MonitoredUrl targetUrl) {

        boolean isUp = false;
        String detectedError = "";

        try {
            var response = webClient.get()
                    .uri(targetUrl.getUrl())
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            if (response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is3xxRedirection()) {
                isUp = true;
            } else {
                detectedError = "HTTP " + response.getStatusCode().value();
            }
        } catch (Exception e) {
            detectedError = e.getMessage();
        }

        targetUrl.setLastCheckedAt(LocalDateTime.now());
        targetUrl.setLastStatus(isUp ? "UP" : "DOWN");
        urlRepository.save(targetUrl);

        Optional<Outage> openOutage = outageRepository.findByMonitoredUrlAndEndTimeIsNull(targetUrl);

        if (!isUp) {
            if (openOutage.isEmpty()) {
                Outage newOutage = new Outage();
                newOutage.setMonitoredUrl(targetUrl);
                newOutage.setStartTime(LocalDateTime.now());
                newOutage.setReason(detectedError);
                outageRepository.save(newOutage);

                System.out.println("Site Down: " + targetUrl.getName());
            }
        } else { // Site está UP
            if (openOutage.isPresent()) {
                Outage outage = openOutage.get();
                outage.setEndTime(LocalDateTime.now());
                outageRepository.save(outage);

                long secondsDown = Duration.between(outage.getStartTime(), outage.getEndTime()).toSeconds();

                UrlStatistics stats = urlStatisticsRepository.findByMonitoredUrl(targetUrl)
                        .orElseGet(() -> {
                            UrlStatistics newStats = new UrlStatistics();
                            newStats.setMonitoredUrl(targetUrl);
                            return newStats;
                        });

                stats.setTotalOutages(stats.getTotalOutages() + 1);
                stats.setTotalDowntimeSeconds(stats.getTotalDowntimeSeconds() + secondsDown);
                urlStatisticsRepository.save(stats);

                System.out.println("Estatística atualizada: " + secondsDown + " segundos acumulados.");
            }
        }
    }
}