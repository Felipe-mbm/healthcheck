package com.example.health_check.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "monitored_urls")
public class MonitoredUrl {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name")
    private String name;

    @Column(nullable = false)
    private String url;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "last_status")
    private String lastStatus;

    @Column(name = "last_checked_at")
    private LocalDateTime lastCheckedAt;

    @OneToMany(mappedBy = "monitoredUrl", fetch = FetchType.LAZY)
    private java.util.List<Outage> outages;
}