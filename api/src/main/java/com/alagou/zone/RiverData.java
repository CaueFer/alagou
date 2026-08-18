package com.alagou.zone;

import java.time.Instant;

public record RiverData(
        String stationCode,
        String stationName,
        Double level,
        Instant lastUpdate
) {}
