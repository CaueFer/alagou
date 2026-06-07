package com.alagou.dto;

import com.alagou.domain.AlertType;

import java.time.Instant;
import java.util.List;

public record AlertResponse(
        Long id,
        AlertType type,
        String username,
        List<String> photoUrls,
        Instant expirationDate,
        Instant creationDate
) {}
