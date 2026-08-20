package com.alagou.weather.controller;

import com.alagou.weather.dto.WeatherResponse;
import com.alagou.weather.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService service;

    public WeatherController(WeatherService service) {
        this.service = service;
    }

    @GetMapping
    public WeatherResponse getCurrentWeather(@RequestParam double lat, @RequestParam double lng) {
        return service.getCurrentWeather(lat, lng);
    }
}
