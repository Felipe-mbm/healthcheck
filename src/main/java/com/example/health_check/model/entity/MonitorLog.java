package com.example.health_check.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "monitor_logs")
public class MonitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String status;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @ManyToOne
    @JoinColumn(name = "url_id", nullable = false)
    private MonitoredUrl monitoredUrl;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;
}
