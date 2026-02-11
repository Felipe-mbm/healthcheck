package com.example.health_check.repository;

import com.example.health_check.model.entity.MonitoredUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonitoredUrlRepository extends JpaRepository<MonitoredUrl, String> {
    boolean existsByUrl(String url);

    @Query("SELECT DISTINCT u FROM MonitoredUrl u LEFT JOIN FETCH u.outages")
    List<MonitoredUrl> findAllWithOutages();

    @Query("SELECT DISTINCT u FROM MonitoredUrl u LEFT JOIN FETCH u.outages WHERE u.lastStatus = 'DOWN'")
    List<MonitoredUrl> findDownUrlsWithOutages();
}
