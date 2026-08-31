package com.alagou.alert.controller;

import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.alert.service.AlertService;
import com.alagou.clearreport.dto.ClearReportResponse;
import com.alagou.clearreport.service.ClearReportService;
import com.alagou.confirmation.dto.ConfirmationResponse;
import com.alagou.confirmation.service.ConfirmationService;
import com.alagou.security.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@Validated
public class AlertController {

    private static final String USERNAME_PATTERN = "^[\\p{L}\\p{N} _-]+$";

    private final AlertService service;
    private final ConfirmationService confirmationService;
    private final ClearReportService clearReportService;
    private final ClientIpResolver clientIpResolver;

    public AlertController(AlertService service, ConfirmationService confirmationService,
                           ClearReportService clearReportService, ClientIpResolver clientIpResolver) {
        this.service = service;
        this.confirmationService = confirmationService;
        this.clearReportService = clearReportService;
        this.clientIpResolver = clientIpResolver;
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
            @RequestParam @Size(max = 40) @Pattern(regexp = USERNAME_PATTERN) String username,
            @RequestParam Severity severity,
            @RequestParam @DecimalMin("-90") @DecimalMax("90") double lat,
            @RequestParam @DecimalMin("-180") @DecimalMax("180") double lng,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        return ResponseEntity.status(201).body(service.create(type, username, severity, lat, lng, photos));
    }

    @PostMapping("/{id}/confirmations")
    public ResponseEntity<ConfirmationResponse> confirm(
            @PathVariable Long id,
            @RequestParam @Size(max = 40) @Pattern(regexp = USERNAME_PATTERN) String username,
            HttpServletRequest request) {
        return ResponseEntity.status(201).body(confirmationService.create(id, username, clientIpResolver.resolve(request)));
    }

    @PostMapping("/{id}/clear-reports")
    public ResponseEntity<ClearReportResponse> reportClear(
            @PathVariable Long id,
            @RequestParam @Size(max = 40) @Pattern(regexp = USERNAME_PATTERN) String username,
            HttpServletRequest request) {
        return ResponseEntity.status(201).body(clearReportService.create(id, username, clientIpResolver.resolve(request)));
    }
}
