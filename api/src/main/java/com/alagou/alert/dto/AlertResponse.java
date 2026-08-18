package com.alagou.alert.dto;

import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;

import java.time.Instant;
import java.util.List;

public record AlertResponse(
        Long id,
        AlertType type,
        String username,
        Severity severity,
        Double lat,
        Double lng,
        List<String> photoUrls,
        long confirmationCount,
        long clearReportCount,
        Instant expirationDate,
        Instant creationDate
) {}
