package com.example.health_check.service;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage;
import com.example.health_check.model.entity.UrlStatistics;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.OutageRepository;
import com.example.health_check.repository.UrlStatisticsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class HealthCheckService {

    private final MonitoredUrlRepository urlRepository;
    private final OutageRepository outageRepository;
    private final UrlStatisticsRepository urlStatisticsRepository;
    private final WebClient webClient;
    private final TransactionTemplate transactionTemplate;

    @Value("${app.http.timeout}")
    private int timeout;

    public HealthCheckService(MonitoredUrlRepository urlRepository, OutageRepository outageRepository, UrlStatisticsRepository urlStatisticsRepository, WebClient webClient, TransactionTemplate transactionTemplate) {
        this.urlRepository = urlRepository;
        this.outageRepository = outageRepository;
        this.urlStatisticsRepository = urlStatisticsRepository;
        this.webClient = webClient;
        this.transactionTemplate = transactionTemplate;
    }

    public void checkUrl(MonitoredUrl targetUrl) {

        boolean isUp = false;
        String detectedError = "";

        try {
            var response = webClient.get()
                    .uri(targetUrl.getUrl())
                    .retrieve()
                    .toBodilessEntity()
                    .retry(2)
                    .block();

            if (response != null && (response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is3xxRedirection())) {
                isUp = true;
            } else {
                detectedError = "HTTP " + (response != null ? response.getStatusCode().value() : "No Response");
            }
        } catch (Exception e) {
            detectedError = e.getMessage();

            if (e.getMessage().contains("Timeout")) {
                detectedError = "Timeout (Excessive Slowness > " + timeout + "s";
            } else if (e.getMessage() != null && e.getMessage().contains("Connection refused")) {
                detectedError = "Connection Refused (Server down)";
            }
        }

        final boolean finalIsUp = isUp;
        final String finalError = detectedError;

        transactionTemplate.executeWithoutResult(transactionStatus -> {
            targetUrl.setLastCheckedAt(LocalDateTime.now());
            targetUrl.setLastStatus(finalIsUp ? "UP" : "DOWN");
            urlRepository.save(targetUrl);

            Optional<Outage> openOutage = outageRepository.findByMonitoredUrlAndEndTimeIsNull(targetUrl);

            if (!finalIsUp) {
                if (openOutage.isEmpty()) {
                    Outage newOutage = new Outage();
                    newOutage.setMonitoredUrl(targetUrl);
                    newOutage.setStartTime(LocalDateTime.now());
                    newOutage.setReason(finalError);
                    outageRepository.save(newOutage);

                   log.error("Site Down: {} | Error: {}", targetUrl.getName(), finalError);
                }
            } else {
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

                    log.info("Updated statistic: Site {} | Timeout:  {} seconds.", targetUrl.getName(), secondsDown);
                }
            }
        });
    }
}