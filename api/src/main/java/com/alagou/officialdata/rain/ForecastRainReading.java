package com.alagou.officialdata.rain;

import java.time.Instant;

public record ForecastRainReading(
        Double accumulated1hMm,
        Double accumulated24hMm,
        Instant observedAt
) {}
