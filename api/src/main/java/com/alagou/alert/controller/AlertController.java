package com.alagou.alert.controller;

import com.alagou.alert.AlertType;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.alert.service.AlertService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService service;

    public AlertController(AlertService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlertResponse> findAll(
            @RequestParam(required = false) Boolean expired,
            @RequestParam(defaultValue = "recent") String order) {
        return service.findAll(expired, order);
    }

    @GetMapping("/{id}")
    public AlertResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AlertResponse> create(
            @RequestParam AlertType type,
            @RequestParam String username,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        return ResponseEntity.status(201).body(service.create(type, username, lat, lng, photos));
    }
}
