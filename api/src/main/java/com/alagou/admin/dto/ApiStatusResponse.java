package com.alagou.admin.dto;

import java.time.Instant;

public record ApiStatusResponse(
        String status,
        String database,
        Instant startedAt,
        long uptimeSeconds,
        Instant timestamp,
        String version
) {
}
