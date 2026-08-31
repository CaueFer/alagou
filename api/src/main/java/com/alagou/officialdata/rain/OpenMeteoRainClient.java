package com.alagou.officialdata.rain;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Component
public class OpenMeteoRainClient {

    private static final int PAST_HOURS = 24;

    private final RestClient restClient;
    private final String baseUrl;

    public OpenMeteoRainClient(RestClient.Builder builder, @Value("${app.officialdata.openmeteo.base-url}") String baseUrl) {
        this.restClient = builder.build();
        this.baseUrl = baseUrl;
    }

    public ForecastRainReading fetchRain(double latitude, double longitude) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("hourly", "precipitation")
                .queryParam("past_hours", PAST_HOURS)
                .queryParam("forecast_hours", 1)
                .queryParam("timezone", "UTC")
                .build()
                .encode()
                .toUri();

        JsonNode response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(JsonNode.class);

        JsonNode hourly = response != null ? response.path("hourly") : null;
        if (hourly == null || !hourly.path("precipitation").isArray() || !hourly.path("time").isArray()) {
            throw new IllegalStateException("Open-Meteo retornou resposta sem série horária de precipitação");
        }

        List<Double> values = new ArrayList<>();
        for (JsonNode value : hourly.path("precipitation")) {
            values.add(value.isNumber() ? value.asDouble() : null);
        }

        List<Double> completedHours = values.subList(0, Math.min(PAST_HOURS, values.size()));
        Double accumulated24h = sum(completedHours);
        Double accumulated1h = completedHours.isEmpty() ? null : completedHours.get(completedHours.size() - 1);

        JsonNode times = hourly.path("time");
        Instant observedAt = times.isEmpty()
                ? Instant.now()
                : LocalDateTime.parse(times.get(times.size() - 1).asText()).toInstant(ZoneOffset.UTC);

        return new ForecastRainReading(accumulated1h, accumulated24h, observedAt);
    }

    private Double sum(List<Double> values) {
        double total = 0;
        boolean hasValue = false;
        for (Double value : values) {
            if (value != null) {
                total += value;
                hasValue = true;
            }
        }
        return hasValue ? total : null;
    }
}
