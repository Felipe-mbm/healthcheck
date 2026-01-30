package com.example.health_check.controller;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.service.HealthCheckService;
import com.example.health_check.service.MonitoredUrlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/urls")
public class MonitoredUrlController {

    private final MonitoredUrlService service;

    public MonitoredUrlController(MonitoredUrlService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MonitoredUrlDto.Response> register(@RequestBody MonitoredUrlDto.CreateRequest request) {
        MonitoredUrlDto.Response newUrl = service.register(request);

        return ResponseEntity
                .created(URI.create("/urls/" + newUrl.id()))
                .body(newUrl);
    }

    @GetMapping
    public ResponseEntity<List<MonitoredUrlDto.Response>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}