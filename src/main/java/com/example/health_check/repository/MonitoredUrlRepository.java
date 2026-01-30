package com.example.health_check.repository;

import com.example.health_check.model.entity.MonitoredUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonitoredUrlRepository extends JpaRepository<MonitoredUrl, String> {
    boolean existsByUrl(String url);
}
