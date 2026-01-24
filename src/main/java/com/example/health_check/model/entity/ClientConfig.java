package com.example.health_check.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "client_configs")
public class ClientConfig {

    @Id
    @Column(name = "client_id")
    private String clientId;

    @Column(name = "check_interval")
    private int checkInterval = 1;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;
}
