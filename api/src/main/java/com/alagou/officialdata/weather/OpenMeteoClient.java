package com.alagou.officialdata.weather;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
public class OpenMeteoClient {

    private final RestClient restClient;
    private final String baseUrl;

    public OpenMeteoClient(RestClient.Builder builder, @Value("${app.officialdata.openmeteo.base-url}") String baseUrl) {
        this.restClient = builder.build();
        this.baseUrl = baseUrl;
    }

    public CurrentWeatherReading fetchCurrent(double lat, double lng) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("latitude", lat)
                .queryParam("longitude", lng)
                .queryParam("current", "temperature_2m,weather_code,is_day")
                .queryParam("timezone", "UTC")
                .build()
                .encode()
                .toUri();

        OpenMeteoResponse response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(OpenMeteoResponse.class);

        if (response == null || response.current() == null) {
            throw new IllegalStateException("Open-Meteo retornou resposta vazia");
        }

        return toReading(response.current());
    }

    private CurrentWeatherReading toReading(OpenMeteoResponse.Current current) {
        Instant observedAt = LocalDateTime.parse(current.time()).toInstant(ZoneOffset.UTC);
        boolean isDay = current.isDay() == null || current.isDay() == 1;
        return new CurrentWeatherReading(current.temperature(), mapWeatherCodeToCondition(current.weatherCode()),
                current.weatherCode(), isDay, observedAt);
    }

    private String mapWeatherCodeToCondition(Integer code) {
        if (code == null) {
            return "Condição desconhecida";
        }
        if (code == 0) {
            return "Céu limpo";
        }
        if (code >= 1 && code <= 3) {
            return "Parcialmente nublado";
        }
        if (code == 45 || code == 48) {
            return "Nevoeiro";
        }
        if (code >= 51 && code <= 57) {
            return "Garoa";
        }
        if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
            return "Chuva";
        }
        if (code >= 95 && code <= 99) {
            return "Tempestade";
        }
        return "Condição desconhecida";
    }
}
