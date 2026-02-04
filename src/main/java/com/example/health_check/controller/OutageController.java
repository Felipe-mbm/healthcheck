package com.example.health_check.controller;

import com.example.health_check.model.entity.Outage;
import com.example.health_check.repository.OutageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/outages")
public class OutageController {

    @Autowired
    private OutageRepository outageRepository;

    @GetMapping("/{urlId}")
    public ResponseEntity<List<Outage>> getHistoryByUrl(@PathVariable String urlId){
        // Busca o histórico usando o método que criamos no Repository
        List<Outage> history = outageRepository.findByMonitoredUrl_IdOrderByStartTimeDesc(urlId);
        // Retorna a lista (mesmo que vazia) com status 200 OK
        return ResponseEntity.ok(history);
    }
}