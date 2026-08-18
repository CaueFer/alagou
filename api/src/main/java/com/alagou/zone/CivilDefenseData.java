package com.alagou.zone;

import java.time.Instant;
import java.util.List;

public record CivilDefenseData(
        Integer alertLevel,
        List<String> recentAlerts,
        Instant lastUpdate
) {}
