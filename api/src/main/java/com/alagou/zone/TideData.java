package com.alagou.zone;

import java.time.Instant;

public record TideData(
        Double nearestExtremeHeightMeters,
        Instant lastUpdate,
        String status
) {}
