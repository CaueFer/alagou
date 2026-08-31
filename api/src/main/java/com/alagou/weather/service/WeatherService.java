package com.alagou.weather.service;

import com.alagou.officialdata.weather.CurrentWeatherReading;
import com.alagou.officialdata.weather.OpenMeteoClient;
import com.alagou.weather.dto.WeatherResponse;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class WeatherService {

    private final OpenMeteoClient client;

    // Current weather does not change within minutes; caching by coarse coordinates caps the fan-out
    // of upstream calls under a request flood.
    private final Cache<String, WeatherResponse> cache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(10))
            .maximumSize(10_000)
            .build();

    public WeatherService(OpenMeteoClient client) {
        this.client = client;
    }

    public WeatherResponse getCurrentWeather(double lat, double lng) {
        String key = round(lat) + "," + round(lng);
        return cache.get(key, ignored -> fetch(lat, lng));
    }

    private WeatherResponse fetch(double lat, double lng) {
        CurrentWeatherReading reading = client.fetchCurrent(lat, lng);
        return new WeatherResponse(reading.temperature(), reading.condition(), reading.weatherCode(), reading.isDay(), reading.observedAt());
    }

    private static double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
