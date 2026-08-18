package com.alagou.confirmation.dto;

import java.time.Instant;

public record ConfirmationResponse(
        Long id,
        Long alertId,
        String username,
        Instant createdAt,
        Instant alertExpirationDate
) {}
