package com.alagou.officialdata.weather;

import java.time.Instant;

public record CurrentWeatherReading(Double temperature, String condition, Integer weatherCode, boolean isDay, Instant observedAt) {}
