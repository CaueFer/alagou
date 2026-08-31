package com.alagou.zone;

public record RainWindow(
        Double measuredMm,
        Double forecastMm,
        Double averageMm
) {
    public static RainWindow of(Double measuredMm, Double forecastMm) {
        if (measuredMm == null && forecastMm == null) {
            return new RainWindow(null, null, null);
        }
        if (measuredMm == null) {
            return new RainWindow(null, forecastMm, forecastMm);
        }
        if (forecastMm == null) {
            return new RainWindow(measuredMm, null, measuredMm);
        }
        return new RainWindow(measuredMm, forecastMm, (measuredMm + forecastMm) / 2);
    }
}
