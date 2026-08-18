package com.alagou.zone;

import java.time.Instant;

public record TideData(
        Double currentLevel,
        Instant lastUpdate,
        String status
) {}
