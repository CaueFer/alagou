package com.alagou.zone;

import java.time.Instant;

public record TideData(
        Double currentHeightMeters,
        Instant lastUpdate,
        String status
) {}
