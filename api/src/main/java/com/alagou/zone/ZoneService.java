package com.alagou.zone;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ZoneService {

    private final ObjectMapper objectMapper;
    private final List<Zone> zones = new ArrayList<>();
    private final Map<String, ZoneData> zoneDataMap = new ConcurrentHashMap<>();

    public ZoneService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void loadZones() {
        try {
            InputStream is = new ClassPathResource("zones.json").getInputStream();
            JsonNode root = objectMapper.readTree(is);
            JsonNode features = root.path("features");

            for (JsonNode feature : features) {
                String id = feature.path("properties").path("id").asText();
                String name = feature.path("properties").path("name").asText();
                JsonNode coordinates = feature.path("geometry").path("coordinates");

                List<List<List<Double>>> polygon = new ArrayList<>();
                for (JsonNode ring : coordinates) {
                    List<List<Double>> ringCoords = new ArrayList<>();
                    for (JsonNode point : ring) {
                        ringCoords.add(List.of(point.get(0).asDouble(), point.get(1).asDouble()));
                    }
                    polygon.add(ringCoords);
                }

                zones.add(new Zone(id, name, polygon));
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load zones.json", e);
        }
    }

    public List<Zone> getZones() {
        return zones;
    }

    public List<ZoneData> getAllZoneData() {
        return new ArrayList<>(zoneDataMap.values());
    }

    public void updateZoneData(ZoneData data) {
        zoneDataMap.put(data.zoneId(), data);
    }
}
