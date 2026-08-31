package com.alagou.admin.scheduler;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SchedulerExecutionTracker {

    private final Map<String, SchedulerExecutionInfo> executions = new ConcurrentHashMap<>();

    public void recordSuccess(String key, long durationMs) {
        Instant now = Instant.now();
        executions.compute(key, (k, previous) -> new SchedulerExecutionInfo(
                now,
                now,
                previous == null ? null : previous.lastErrorAt(),
                previous == null ? null : previous.lastErrorMessage(),
                durationMs,
                previous == null ? 1 : previous.runCount() + 1,
                previous == null ? 0 : previous.failureCount()
        ));
    }

    public void recordFailure(String key, long durationMs, Throwable error) {
        Instant now = Instant.now();
        executions.compute(key, (k, previous) -> new SchedulerExecutionInfo(
                now,
                previous == null ? null : previous.lastSuccessAt(),
                now,
                error.getMessage(),
                durationMs,
                previous == null ? 1 : previous.runCount() + 1,
                previous == null ? 1 : previous.failureCount() + 1
        ));
    }

    public SchedulerExecutionInfo getInfo(String key) {
        return executions.get(key);
    }

    public Map<String, SchedulerExecutionInfo> snapshot() {
        return Map.copyOf(executions);
    }
}
