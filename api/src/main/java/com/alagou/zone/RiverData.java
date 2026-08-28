package com.alagou.zone;

import java.time.Instant;

public record RiverData(
        String stationCode,
        String stationName,
        Double level,
        RiverStatus status,
        Instant lastUpdate
) {

    public RiverData(String stationCode, String stationName, Double level, Instant lastUpdate) {
        this(stationCode, stationName, level, RiverStatus.UNKNOWN, lastUpdate);
    }
}