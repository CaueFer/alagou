package com.alagou.admin.dto;

import java.time.Instant;

public record SchedulerStatusResponse(
        String id,
        String name,
        String description,
        String interval,
        Instant lastRunAt,
        Instant lastSuccessAt,
        Instant lastErrorAt,
        String lastErrorMessage,
        long lastDurationMs,
        long runCount,
        long failureCount,
        Instant nextExpectedRunAt,
        String status
) {
}
