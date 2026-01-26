package com.example.health_check.dto;

import com.example.health_check.model.enums.UserRole;
import java.time.LocalDateTime;

public class UserDto {

    public record CreateRequest(
            String email,
            UserRole role,
            Integer checkInterval
    ) {}

    public record UpdateSettingsRequest(
            Integer checkInterval
    ) {}

    public record Response(
            String id,
            String email,
            UserRole role,
            int checkInterval,
            LocalDateTime lastActiveAt
    ) {}
}
