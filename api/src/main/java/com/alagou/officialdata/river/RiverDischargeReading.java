package com.alagou.officialdata.river;

import java.time.Instant;

public record RiverDischargeReading(
        Double dischargeCubicMetersPerSecond,
        Double forecastPeakCubicMetersPerSecond,
        Instant observedAt
) {}
