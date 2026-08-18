package com.alagou.alert.dto;

import com.alagou.alert.AlertType;

import java.time.Instant;
import java.util.List;

public record AlertResponse(
        Long id,
        AlertType type,
        String username,
        Double lat,
        Double lng,
        List<String> photoUrls,
        Instant expirationDate,
        Instant creationDate
) {}
