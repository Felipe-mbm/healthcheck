package com.example.health_check.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "outages")
public class Outage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "url_id", nullable = false)
    private MonitoredUrl monitoredUrl;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "reason")
    private String reason;

    public long getDurationInMinutes() {
        if (this.startTime == null) {
            return 0;
        }
        LocalDateTime end = (this.endTime != null) ? this.endTime : LocalDateTime.now();

        return java.time.Duration.between(this.startTime, end).toMinutes();
    }
    }

