package com.alagou.weather.service;

import com.alagou.officialdata.weather.CurrentWeatherReading;
import com.alagou.officialdata.weather.OpenMeteoClient;
import com.alagou.weather.dto.WeatherResponse;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private final OpenMeteoClient client;

    public WeatherService(OpenMeteoClient client) {
        this.client = client;
    }

    public WeatherResponse getCurrentWeather(double lat, double lng) {
        CurrentWeatherReading reading = client.fetchCurrent(lat, lng);
        return new WeatherResponse(reading.temperature(), reading.condition(), reading.weatherCode(), reading.isDay(), reading.observedAt());
    }
}
