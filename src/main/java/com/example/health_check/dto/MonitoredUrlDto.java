package com.example.health_check.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

public class MonitoredUrlDto {

    public record CreateRequest(
            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "URL is required")
            @URL(message = "Invalid URL format")
            String url
    ) {}

    public record Response(
            String id,
            String name,
            String url,
            boolean isActive,
            String lastStatus,
            LocalDateTime lastCheckedAt,
            long totalDowntimeMinutes
    ) {}

    public record UpdateRequest (
            String name,
            @URL(message = "Invalid URL format")
            String url,
            Boolean isActive
    ) {}
}