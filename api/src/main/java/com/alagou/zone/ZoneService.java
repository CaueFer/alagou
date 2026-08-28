package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ZoneService {

    private static final Logger log = LoggerFactory.getLogger(ZoneService.class);

    private final ObjectMapper objectMapper;
    private final ZoneSnapshotRepository snapshotRepository;
    private final List<Zone> zones = new ArrayList<>();
    private final Map<String, ZoneData> zoneDataMap = new ConcurrentHashMap<>();

    public ZoneService(ObjectMapper objectMapper, ZoneSnapshotRepository snapshotRepository) {
        this.objectMapper = objectMapper;
        this.snapshotRepository = snapshotRepository;
    }

    @PostConstruct
    public void loadZones() {
        loadZonesFromResource();
        loadSnapshots();
    }

    private void loadZonesFromResource() {
        try {
            InputStream is = new ClassPathResource("zones.json").getInputStream();
            JsonNode root = objectMapper.readTree(is);
            JsonNode features = root.path("features");

            for (JsonNode feature : features) {
                JsonNode properties = feature.path("properties");
                String id = properties.path("id").asText();
                String name = properties.path("name").asText();
                JsonNode coordinates = feature.path("geometry").path("coordinates");

                List<List<List<List<Double>>>> polygon = new ArrayList<>();
                for (JsonNode polygonNode : coordinates) {
                    List<List<List<Double>>> rings = new ArrayList<>();
                    for (JsonNode ring : polygonNode) {
                        List<List<Double>> ringCoords = new ArrayList<>();
                        for (JsonNode point : ring) {
                            ringCoords.add(List.of(point.get(0).asDouble(), point.get(1).asDouble()));
                        }
                        rings.add(ringCoords);
                    }
                    polygon.add(rings);
                }

                List<String> neighborhoods = new ArrayList<>();
                for (JsonNode neighborhood : properties.path("neighborhoods")) {
                    neighborhoods.add(neighborhood.asText());
                }

                List<String> riverStations = new ArrayList<>();
                for (JsonNode station : properties.path("riverStations")) {
                    riverStations.add(station.asText());
                }

                boolean tideAffected = properties.path("tideAffected").asBoolean(false);

                zones.add(new Zone(id, name, polygon, neighborhoods, riverStations, tideAffected));
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load zones.json", e);
        }
    }

    private void loadSnapshots() {
        for (ZoneSnapshot snapshot : snapshotRepository.findAll()) {
            try {
                ZoneData data = objectMapper.readValue(snapshot.getPayload(), ZoneData.class);
                zoneDataMap.put(snapshot.getZoneId(), data);
            } catch (IOException e) {
                log.error("Failed to parse zone snapshot for zone {}", snapshot.getZoneId(), e);
            }
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
        try {
            String payload = objectMapper.writeValueAsString(data);
            snapshotRepository.save(new ZoneSnapshot(data.zoneId(), payload, data.lastUpdate()));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize zone snapshot for zone {}", data.zoneId(), e);
        }
    }

    public List<RiverData> getLastKnownRiverData(String zoneId) {
        ZoneData data = zoneDataMap.get(zoneId);
        return data != null && data.rivers() != null ? data.rivers() : List.of();
    }

    public CivilDefenseData getLastKnownCivilDefenseData(String zoneId) {
        ZoneData data = zoneDataMap.get(zoneId);
        if (data != null && data.civilDefense() != null) {
            return data.civilDefense();
        }
        return new CivilDefenseData(CivilDefenseRiskLevel.NONE, List.of(), Instant.now());
    }
}