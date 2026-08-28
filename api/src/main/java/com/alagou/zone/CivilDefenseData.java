package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseRiskLevel;

import java.time.Instant;
import java.util.List;

public record CivilDefenseData(
        CivilDefenseRiskLevel riskLevel,
        List<String> recentAlerts,
        Instant lastUpdate
) {}