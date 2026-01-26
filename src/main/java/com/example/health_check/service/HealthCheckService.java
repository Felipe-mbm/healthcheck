package com.example.health_check.service;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.MonitoredUrlRepository;
import com.example.health_check.repository.OutageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class HealthCheckService {

    private final MonitoredUrlRepository urlRepository;
    private final OutageRepository outageRepository;
    private final WebClient webClient;

    public HealthCheckService(MonitoredUrlRepository urlRepository, OutageRepository outageRepository, WebClient webClient) {
        this.urlRepository = urlRepository;
        this.outageRepository = outageRepository;
        this.webClient = webClient;
    }

    public void checkUrl(MonitoredUrl targetUrl, User user) {

        boolean isUp = false;
        String detectedError = ""; // erroDetectado -> detectedError

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
                Outage newOutage = new Outage(); // novaQueda -> newOutage
                newOutage.setMonitoredUrl(targetUrl);
                newOutage.setStartTime(LocalDateTime.now());
                newOutage.setReason(detectedError);
                outageRepository.save(newOutage);

                // Log traduzido
                System.out.println("Site Down: " + targetUrl.getName());
            }
        } else {
            if (openOutage.isPresent()) {
                Outage outage = openOutage.get(); // queda -> outage
                outage.setEndTime(LocalDateTime.now());
                outageRepository.save(outage);

                // Log traduzido
                System.out.println("Site Back Up: " + targetUrl.getName());
            }
        }
    }
}