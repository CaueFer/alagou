package com.alagou.admin.dto;

import java.time.LocalDate;
import java.util.Map;

public record AlertTimelinePointResponse(
        LocalDate date,
        long total,
        Map<String, Long> bySeverity,
        Map<String, Long> byType
) {
}
