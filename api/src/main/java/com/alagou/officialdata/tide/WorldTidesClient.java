package com.alagou.officialdata.tide;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.List;

@Component
public class WorldTidesClient {

    private final RestClient restClient;
    private final String baseUrl;
    private final String apiKey;
    private final double lat;
    private final double lon;

    public WorldTidesClient(
            RestClient.Builder builder,
            @Value("${app.officialdata.worldtides.base-url}") String baseUrl,
            @Value("${app.officialdata.worldtides.key}") String apiKey,
            @Value("${app.officialdata.worldtides.lat}") double lat,
            @Value("${app.officialdata.worldtides.lon}") double lon
    ) {
        this.restClient = builder.build();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.lat = lat;
        this.lon = lon;
    }

    public List<TideExtreme> fetchExtremes(int days) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("extremes", "")
                .queryParam("days", days)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUri();

        WorldTidesResponse response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(WorldTidesResponse.class);

        if (response == null || response.extremes() == null) {
            return List.of();
        }
        return response.extremes().stream().map(this::toExtreme).toList();
    }

    private TideExtreme toExtreme(WorldTidesResponse.RawExtreme raw) {
        TideType type = "High".equalsIgnoreCase(raw.type()) ? TideType.HIGH : TideType.LOW;
        return new TideExtreme(Instant.ofEpochSecond(raw.dt()), raw.height(), type);
    }
}
