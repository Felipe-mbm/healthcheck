package com.example.health_check.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDto(
    @NotBlank(message = "The Google token is required.")
    String credential
    ) {}
