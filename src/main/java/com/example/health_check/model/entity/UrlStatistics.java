package com.example.health_check.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "url_statistics")
public class UrlStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "url_id", nullable = false)
    private MonitoredUrl monitoredUrl;

    private Integer totalOutages = 0;
    private Long totalDowntimeSeconds = 0L;
}