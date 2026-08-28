package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ZoneServiceTest {

    @Mock
    private ZoneSnapshotRepository snapshotRepository;

    private ZoneService zoneService;

    @BeforeEach
    void setUp() {
        when(snapshotRepository.findAll()).thenReturn(List.of());
        ObjectMapper objectMapper = JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
        zoneService = new ZoneService(objectMapper, snapshotRepository);
        zoneService.loadZones();
    }

    @Test
    void shouldLoadZonesFromJson() {
        List<Zone> zones = zoneService.getZones();

        assertFalse(zones.isEmpty());
        assertEquals(8, zones.size());

        Zone centro = zones.stream()
                .filter(z -> z.id().equals("centro"))
                .findFirst()
                .orElseThrow();

        assertEquals("Centro", centro.name());
        assertNotNull(centro.polygon());
        assertFalse(centro.polygon().isEmpty());
        assertEquals(List.of("82274000"), centro.riverStations());
        assertTrue(centro.tideAffected());
        assertFalse(centro.neighborhoods().isEmpty());
    }

    @Test
    void shouldLoadNonTideAffectedZone() {
        Zone oeste = zoneService.getZones().stream()
                .filter(z -> z.id().equals("oeste"))
                .findFirst()
                .orElseThrow();

        assertFalse(oeste.tideAffected());
        assertTrue(oeste.riverStations().isEmpty());
    }

    @Test
    void shouldLoadMultiPolygonZones() {
        Zone norte = zoneService.getZones().stream()
                .filter(z -> z.id().equals("norte"))
                .findFirst()
                .orElseThrow();

        assertFalse(norte.polygon().isEmpty());
        assertEquals(2, norte.polygon().size());
        for (List<List<List<Double>>> polygon : norte.polygon()) {
            assertFalse(polygon.isEmpty());
            List<List<Double>> exterior = polygon.get(0);
            assertEquals(exterior.get(0), exterior.get(exterior.size() - 1));
        }
    }

    @Test
    void shouldUpdateAndGetZoneData() {
        ZoneData data = new ZoneData(
                "centro",
                "Centro",
                List.of(List.of(List.of(List.of(-48.8550, -26.2950)))),
                List.of(),
                new TideData(1.5, Instant.now(), "HIGH_TIDE"),
                new CivilDefenseData(CivilDefenseRiskLevel.ALERT, List.of("Alerta teste"), Instant.now()),
                OverallStatus.ALERT,
                Instant.now()
        );

        zoneService.updateZoneData(data);

        List<ZoneData> allData = zoneService.getAllZoneData();
        assertFalse(allData.isEmpty());
        assertEquals("centro", allData.get(0).zoneId());
        verify(snapshotRepository).save(any(ZoneSnapshot.class));
    }

    @Test
    void shouldReturnEmptyRiverDataForZoneWithoutSnapshot() {
        List<RiverData> rivers = zoneService.getLastKnownRiverData("norte");

        assertTrue(rivers.isEmpty());
    }

    @Test
    void shouldReturnNoneCivilDefenseForZoneWithoutSnapshot() {
        CivilDefenseData civilDefense = zoneService.getLastKnownCivilDefenseData("norte");

        assertEquals(CivilDefenseRiskLevel.NONE, civilDefense.riskLevel());
    }
}