package com.alagou.admin.scheduler;

import java.time.Instant;

public record SchedulerExecutionInfo(
        Instant lastRunAt,
        Instant lastSuccessAt,
        Instant lastErrorAt,
        String lastErrorMessage,
        long lastDurationMs,
        long runCount,
        long failureCount
) {
}
