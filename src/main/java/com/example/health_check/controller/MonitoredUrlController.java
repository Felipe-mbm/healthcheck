package com.example.health_check.controller;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.dto.UrlStatisticsDto;
import com.example.health_check.service.MonitoredUrlService;
import jakarta.validation.Valid;
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
    public ResponseEntity<MonitoredUrlDto.Response> register(@RequestBody @Valid MonitoredUrlDto.CreateRequest request) {
        MonitoredUrlDto.Response newUrl = service.register(request);
        return ResponseEntity
                .created(URI.create("/urls/" + newUrl.id()))
                .body(newUrl);
    }

    @GetMapping
    public ResponseEntity<List<MonitoredUrlDto.Response>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<UrlStatisticsDto> getStats(@PathVariable String id) {
        return ResponseEntity.ok(service.getStatistics(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @RequestBody MonitoredUrlDto.UpdateRequest request){
        service.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/down")
    public ResponseEntity<List<MonitoredUrlDto.Response>> listDown() {
        return ResponseEntity.ok(service.findDownUrls());
    }
}