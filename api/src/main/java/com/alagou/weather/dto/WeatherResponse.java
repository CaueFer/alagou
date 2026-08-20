package com.alagou.weather.dto;

import java.time.Instant;

public record WeatherResponse(Double temperature, String condition, Instant observedAt) {}
