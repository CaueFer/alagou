package com.alagou.clearreport.dto;

import java.time.Instant;

public record ClearReportResponse(
        Long id,
        Long alertId,
        String username,
        Instant createdAt,
        boolean alertDeactivated
) {}
