package com.example.health_check.dto;

import java.time.LocalDateTime;

public class MonitoredUrlDto {

    public record CreateRequest(
            String name,
            String url
    ) {}

    public record Response(
            String id,
            String name,
            String url,
            boolean isActive,
            String lastStatus,
            LocalDateTime lastCheckedAt
    ) {}
}