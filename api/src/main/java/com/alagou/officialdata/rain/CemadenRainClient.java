package com.alagou.officialdata.rain;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CemadenRainClient {

    private static final Duration CATALOG_TTL = Duration.ofHours(24);
    private static final DateTimeFormatter READING_TIMESTAMP = DateTimeFormatter.ofPattern("dd/MM/yy HH:mm");

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String catalogUrl;
    private final String readingsUrl;
    private final String state;
    private final int cityIbgeCode;

    private Map<Long, CemadenStation> catalog = Map.of();
    private Instant catalogLoadedAt;

    public CemadenRainClient(
            RestClient.Builder builder,
            ObjectMapper objectMapper,
            @Value("${app.officialdata.cemaden.catalog-url}") String catalogUrl,
            @Value("${app.officialdata.cemaden.readings-url}") String readingsUrl,
            @Value("${app.officialdata.cemaden.state}") String state,
            @Value("${app.officialdata.cemaden.city-ibge-code}") int cityIbgeCode
    ) {
        this.restClient = builder.build();
        this.objectMapper = objectMapper;
        this.catalogUrl = catalogUrl;
        this.readingsUrl = readingsUrl;
        this.state = state;
        this.cityIbgeCode = cityIbgeCode;
    }

    public List<CemadenRainReading> fetchCityReadings() {
        Map<Long, CemadenStation> stations = stationCatalog();

        var uri = UriComponentsBuilder.fromUriString(readingsUrl)
                .queryParam("uf", state)
                .build()
                .encode()
                .toUri();

        JsonNode response = readJson(uri.toString(), "as leituras de chuva");
        if (!response.isArray()) {
            throw new IllegalStateException("CEMADEN retornou as leituras de chuva em formato inesperado");
        }

        List<CemadenRainReading> readings = new ArrayList<>();
        for (JsonNode node : response) {
            if (node.path("codibge").asInt() != cityIbgeCode) {
                continue;
            }
            CemadenStation station = stations.get(node.path("idestacao").asLong());
            if (station == null) {
                continue;
            }
            readings.add(new CemadenRainReading(
                    station,
                    millimeters(node.path("ultimovalor")),
                    millimeters(node.path("acc1hr")),
                    millimeters(node.path("acc24hr")),
                    observedAt(node.path("datahoraUltimovalor").asText(null))
            ));
        }
        return readings;
    }

    private synchronized Map<Long, CemadenStation> stationCatalog() {
        if (catalogLoadedAt != null && catalogLoadedAt.isAfter(Instant.now().minus(CATALOG_TTL))) {
            return catalog;
        }

        Map<Long, CemadenStation> loaded = parseCatalog(readUtf8(catalogUrl, "o catálogo de estações"));
        if (loaded.isEmpty()) {
            throw new IllegalStateException("CEMADEN não retornou nenhuma estação para o código IBGE " + cityIbgeCode);
        }

        catalog = loaded;
        catalogLoadedAt = Instant.now();
        return catalog;
    }

    // O CEMADEN serve o catálogo como application/json sem charset e as leituras como text/html,
    // então a resposta é lida como bytes e desserializada à mão: deixar a negociação de conteúdo
    // do Spring decidir faria o JSON ser decodificado em ISO-8859-1 (acentos quebrados) ou recusado
    private String readUtf8(String url, String description) {
        byte[] body = restClient.get()
                .uri(url)
                .retrieve()
                .body(byte[].class);

        if (body == null || body.length == 0) {
            throw new IllegalStateException("CEMADEN retornou resposta vazia para " + description);
        }
        return new String(body, StandardCharsets.UTF_8);
    }

    private JsonNode readJson(String url, String description) {
        try {
            return objectMapper.readTree(readUtf8(url, description));
        } catch (IOException e) {
            throw new IllegalStateException("Falha ao ler " + description + " do CEMADEN", e);
        }
    }

    // O catálogo do CEMADEN é servido como JSONP (`estacoes([...])`) mesmo com extensão .json,
    // então o envelope precisa ser removido antes de desserializar
    private Map<Long, CemadenStation> parseCatalog(String body) {
        int start = body.indexOf('(');
        int end = body.lastIndexOf(')');
        if (start < 0 || end <= start) {
            throw new IllegalStateException("CEMADEN retornou o catálogo de estações em formato inesperado");
        }

        JsonNode root;
        try {
            root = objectMapper.readTree(body.substring(start + 1, end));
        } catch (IOException e) {
            throw new IllegalStateException("Falha ao ler o catálogo de estações do CEMADEN", e);
        }

        Map<Long, CemadenStation> stations = new HashMap<>();
        for (JsonNode group : root) {
            for (JsonNode node : group.path("estacao")) {
                if (node.path("codibge").asInt() != cityIbgeCode) {
                    continue;
                }
                stations.put(node.path("idestacao").asLong(), new CemadenStation(
                        node.path("idestacao").asLong(),
                        node.path("nomeestacao").asText(),
                        node.path("latitude").asDouble(),
                        node.path("longitude").asDouble()
                ));
            }
        }
        return stations;
    }

    private Double millimeters(JsonNode node) {
        return node.isNumber() ? node.asDouble() : null;
    }

    private Instant observedAt(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value, READING_TIMESTAMP).toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
