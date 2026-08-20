package com.alagou.weather.dto;

import java.time.Instant;

public record WeatherResponse(Double temperature, String condition, Integer weatherCode, boolean isDay, Instant observedAt) {}
