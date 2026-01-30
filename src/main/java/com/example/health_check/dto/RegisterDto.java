package com.example.health_check.dto;

import com.example.health_check.model.enums.UserRole;

public record RegisterDto (String email, String password, UserRole role){}
