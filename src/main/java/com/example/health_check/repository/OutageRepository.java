package com.example.health_check.repository;

import com.example.health_check.model.entity.MonitoredUrl;
import com.example.health_check.model.entity.Outage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OutageRepository extends JpaRepository<Outage, String> {
    Optional<Outage> findByMonitoredUrlAndEndTimeIsNull(MonitoredUrl monitoredUrl);
}