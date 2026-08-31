package com.alagou.officialdata.river;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Component
public class OpenMeteoFloodClient {

    private static final int FORECAST_DAYS = 3;

    private final RestClient restClient;
    private final String baseUrl;

    public OpenMeteoFloodClient(RestClient.Builder builder, @Value("${app.officialdata.openmeteo.flood-url}") String baseUrl) {
        this.restClient = builder.build();
        this.baseUrl = baseUrl;
    }

    public RiverDischargeReading fetchDischarge(double latitude, double longitude) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("daily", "river_discharge")
                .queryParam("forecast_days", FORECAST_DAYS)
                .build()
                .encode()
                .toUri();

        JsonNode response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(JsonNode.class);

        JsonNode daily = response != null ? response.path("daily") : null;
        if (daily == null || !daily.path("river_discharge").isArray() || !daily.path("time").isArray()) {
            throw new IllegalStateException("Open-Meteo Flood retornou resposta sem série de vazão");
        }

        JsonNode discharges = daily.path("river_discharge");
        JsonNode times = daily.path("time");
        if (discharges.isEmpty()) {
            throw new IllegalStateException("Open-Meteo Flood retornou série de vazão vazia");
        }

        Double current = discharges.get(0).isNumber() ? discharges.get(0).asDouble() : null;

        Double peak = null;
        for (JsonNode value : discharges) {
            if (value.isNumber() && (peak == null || value.asDouble() > peak)) {
                peak = value.asDouble();
            }
        }

        Instant observedAt = times.isEmpty()
                ? Instant.now()
                : LocalDate.parse(times.get(0).asText()).atStartOfDay().toInstant(ZoneOffset.UTC);

        return new RiverDischargeReading(current, peak, observedAt);
    }
}
