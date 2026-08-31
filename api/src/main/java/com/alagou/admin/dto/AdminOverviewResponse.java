package com.alagou.admin.dto;

import java.util.Map;

public record AdminOverviewResponse(
        long totalUsers,
        long googleAccounts,
        long passwordAccounts,
        long activeUsers,
        long totalAlerts,
        long activeAlerts,
        long expiredAlerts,
        Map<String, Long> alertsByType,
        Map<String, Long> alertsBySeverity,
        long totalConfirmations,
        long totalClearReports,
        long totalCivilDefenseNotices
) {
}
