package com.alagou.zone;

import java.time.Instant;
import java.util.List;

public record ZoneData(
        String zoneId,
        String zoneName,
        List<RiverData> rivers,
        TideData tide,
        CivilDefenseData civilDefense,
        Instant lastUpdate
) {}
