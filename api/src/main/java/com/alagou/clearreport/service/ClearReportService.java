package com.alagou.clearreport.service;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.clearreport.ClearReport;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.clearreport.dto.ClearReportResponse;
import com.alagou.exception.BusinessRuleException;
import com.alagou.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ClearReportService {

    private static final long DEACTIVATION_THRESHOLD = 3;

    private final ClearReportRepository repository;
    private final AlertRepository alertRepository;

    public ClearReportService(ClearReportRepository repository, AlertRepository alertRepository) {
        this.repository = repository;
        this.alertRepository = alertRepository;
    }

    public ClearReportResponse create(Long alertId, String username) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));

        if (repository.existsByAlertIdAndUsername(alertId, username)) {
            throw new BusinessRuleException("User has already reported this alert as clear");
        }

        ClearReport report = repository.save(new ClearReport(alertId, username, Instant.now()));

        boolean deactivated = false;
        if (alert.isActive() && repository.countByAlertId(alertId) >= DEACTIVATION_THRESHOLD) {
            alert.deactivate();
            alertRepository.save(alert);
            deactivated = true;
        }

        return new ClearReportResponse(report.getId(), report.getAlertId(), report.getUsername(),
                report.getCreatedAt(), deactivated);
    }
}
