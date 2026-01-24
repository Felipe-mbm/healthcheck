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
public class MonitorLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String status;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @ManyToOne
    @JoinColumn(name = "url_id", nullable = false)
    private MonitoredUrl monitoredUrl;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientConfig clientConfig;
}
