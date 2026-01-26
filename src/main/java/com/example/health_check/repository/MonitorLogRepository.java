package com.example.health_check.repository;

import com.example.health_check.model.entity.MonitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonitorLogRepository extends JpaRepository<MonitorLog, String> {
}
