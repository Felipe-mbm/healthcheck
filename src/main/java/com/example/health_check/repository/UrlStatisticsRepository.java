package com.example.health_check.repository;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.UrlStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UrlStatisticsRepository extends JpaRepository<UrlStatistics, String> {
    Optional<UrlStatistics> findByMonitoredUrl(MonitoredUrl url);
}