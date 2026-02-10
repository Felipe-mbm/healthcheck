package com.example.health_check.dto;

import com.example.health_check.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class UserDto {

    public record CreateRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Invalid email format")
            String email,
            UserRole role
    ) {}

    public record Response(
            String id,
            String email,
            UserRole role,
            LocalDateTime lastActiveAt
    ) {}

    public record UpdateRequest (
        String email,
        UserRole role
    ) {}
}
