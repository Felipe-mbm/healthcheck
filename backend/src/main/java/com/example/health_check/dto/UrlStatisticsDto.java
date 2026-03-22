package com.example.health_check.dto;

public record UrlStatisticsDto(
        String urlId,
        String urlName,
        Integer totalOutages,
        Long totalDowntimeSeconds,
        String formattedDowntime
) {}