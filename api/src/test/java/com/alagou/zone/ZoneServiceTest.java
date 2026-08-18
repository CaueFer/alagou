package com.alagou.zone;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ZoneServiceTest {

    private ZoneService zoneService;

    @BeforeEach
    void setUp() {
        zoneService = new ZoneService(new com.fasterxml.jackson.databind.ObjectMapper());
        zoneService.loadZones();
    }

    @Test
    void shouldLoadZonesFromJson() {
        List<Zone> zones = zoneService.getZones();

        assertFalse(zones.isEmpty());
        assertEquals(4, zones.size());

        Zone central = zones.stream()
                .filter(z -> z.id().equals("central"))
                .findFirst()
                .orElseThrow();

        assertEquals("Zona Central", central.name());
        assertNotNull(central.polygon());
        assertFalse(central.polygon().isEmpty());
    }

    @Test
    void shouldUpdateAndGetZoneData() {
        ZoneData data = new ZoneData(
                "central",
                "Zona Central",
                List.of(),
                new TideData(1.5, java.time.Instant.now(), "HIGH_TIDE"),
                new CivilDefenseData(1, List.of("Alerta teste"), java.time.Instant.now()),
                java.time.Instant.now()
        );

        zoneService.updateZoneData(data);

        List<ZoneData> allData = zoneService.getAllZoneData();
        assertFalse(allData.isEmpty());
        assertEquals("central", allData.get(0).zoneId());
    }
}
