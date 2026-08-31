package com.alagou.officialdata.rain;

import java.time.Instant;

public record CemadenRainReading(
        CemadenStation station,
        Double lastValueMm,
        Double accumulated1hMm,
        Double accumulated24hMm,
        Instant observedAt
) {}
