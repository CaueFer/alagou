package com.alagou.alert.controller;

import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.alert.service.AlertService;
import com.alagou.clearreport.dto.ClearReportResponse;
import com.alagou.clearreport.service.ClearReportService;
import com.alagou.confirmation.dto.ConfirmationResponse;
import com.alagou.confirmation.service.ConfirmationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService service;
    private final ConfirmationService confirmationService;
    private final ClearReportService clearReportService;

    public AlertController(AlertService service, ConfirmationService confirmationService, ClearReportService clearReportService) {
        this.service = service;
        this.confirmationService = confirmationService;
        this.clearReportService = clearReportService;
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
            @RequestParam Severity severity,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        return ResponseEntity.status(201).body(service.create(type, username, severity, lat, lng, photos));
    }

    @PostMapping("/{id}/confirmations")
    public ResponseEntity<ConfirmationResponse> confirm(@PathVariable Long id, @RequestParam String username) {
        return ResponseEntity.status(201).body(confirmationService.create(id, username));
    }

    @PostMapping("/{id}/clear-reports")
    public ResponseEntity<ClearReportResponse> reportClear(@PathVariable Long id, @RequestParam String username) {
        return ResponseEntity.status(201).body(clearReportService.create(id, username));
    }
}
