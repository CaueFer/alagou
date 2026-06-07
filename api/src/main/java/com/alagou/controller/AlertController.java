package com.alagou.controller;

import com.alagou.domain.AlertType;
import com.alagou.dto.AlertResponse;
import com.alagou.service.AlertService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AlertResponse> create(
            @RequestParam AlertType type,
            @RequestParam String username,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        return ResponseEntity.status(201).body(service.create(type, username, photos));
    }
}
