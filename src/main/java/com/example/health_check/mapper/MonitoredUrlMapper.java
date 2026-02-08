package com.example.health_check.mapper;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage; // Import necessário
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalDateTime;

@Component
public class MonitoredUrlMapper {

    public MonitoredUrl toEntity(MonitoredUrlDto.CreateRequest request) {
        MonitoredUrl entity = new MonitoredUrl();
        entity.setName(request.name());
        entity.setUrl(request.url());
        return entity;
    }

    public MonitoredUrlDto.Response toResponse(MonitoredUrl entity) {
        long totalDowntime = 0;

        if (entity.getOutages() != null) {
            // Pega o tempo de 24 horas atrás a partir de agora
            LocalDateTime limit = LocalDateTime.now().minusHours(24);

            totalDowntime = entity.getOutages().stream()
                    // FILTRO: Só entra no cálculo se a queda começou depois do limite de 24h
                    .filter(outage -> outage.getStartTime().isAfter(limit))
                    .mapToLong(Outage::getDurationInMinutes)
                    .sum();
        }

        return new MonitoredUrlDto.Response(
                entity.getId(),
                entity.getName(),
                entity.getUrl(),
                entity.getIsActive() != null ? entity.getIsActive() : true,
                entity.getLastStatus(),
                entity.getLastCheckedAt(),
                totalDowntime
        );
    }}