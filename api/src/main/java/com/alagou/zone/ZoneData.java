package com.alagou.zone;

import java.time.Instant;
import java.util.List;

public record ZoneData(
        String zoneId,
        String zoneName,
        List<List<List<List<Double>>>> polygon,
        List<RiverData> rivers,
        TideData tide,
        CivilDefenseData civilDefense,
        OverallStatus overallStatus,
        Instant lastUpdate
) {}