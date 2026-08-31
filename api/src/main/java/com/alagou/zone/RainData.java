package com.alagou.zone;

import java.time.Instant;
import java.util.List;

public record RainData(
        RainWindow lastHour,
        RainWindow last24Hours,
        List<String> stationNames,
        RainStatus status,
        Instant lastUpdate
) {}
