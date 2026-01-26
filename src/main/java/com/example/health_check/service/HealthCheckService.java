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

    public void verificarUrl(MonitoredUrl urlAlvo, User usuario) {

        boolean  isUp = false;
        String erroDetectado = "";

        try {
            var response = webClient.get()
                    .uri(urlAlvo.getUrl())
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            if (response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is3xxRedirection()) {
                isUp = true;
            } else {
                erroDetectado = "HTTP " + response.getStatusCode().value();
            }
        } catch (Exception e) {
            erroDetectado =  e.getMessage();
        }

        urlAlvo.setLastCheckedAt(LocalDateTime.now());
        urlAlvo.setLastStatus(isUp ? "UP" : "DOWN");
        urlRepository.save(urlAlvo);

        Optional<Outage> quedaAberta = outageRepository.findByMonitoredUrlAndTimeIsNull(urlAlvo);

        if (!isUp) {
            if (quedaAberta.isEmpty()) {
                Outage novaQueda = new Outage();
                novaQueda.setMonitoredUrl(urlAlvo);
                novaQueda.setStartTime(LocalDateTime.now());
                novaQueda.setReason(erroDetectado);
                outageRepository.save(novaQueda);
                System.out.println("Site Caiu: " + urlAlvo.getName());
            }
        } else {
            if (quedaAberta.isPresent()) {
                Outage queda = quedaAberta.get();
                queda.setEndTime(LocalDateTime.now());
                outageRepository.save(queda);
                System.out.println("Site voltou" + urlAlvo.getName());
            }
        }
    }
}
