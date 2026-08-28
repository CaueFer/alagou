package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.officialdata.river.AnaHidrowebClient;
import com.alagou.officialdata.river.AnaStationThresholds;
import com.alagou.officialdata.river.StationThresholds;
import com.alagou.officialdata.tide.TideExtreme;
import com.alagou.officialdata.tide.TideType;
import com.alagou.officialdata.tide.WorldTidesClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OfficialDataAggregationSchedulerTest {

    private static final String CACHOEIRA = "82274000";
    private static final String CUBATAO = "82270060";

    @Mock
    private ZoneService zoneService;

    @Mock
    private AnaHidrowebClient anaClient;

    @Mock
    private WorldTidesClient tideClient;

    @Mock
    private CivilDefenseNoticeRepository civilDefenseRepository;

    @Mock
    private AnaStationThresholds stationThresholds;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private OfficialDataAggregationScheduler scheduler;

    @BeforeEach
    void setUp() {
        scheduler = new OfficialDataAggregationScheduler(
                zoneService, anaClient, tideClient, civilDefenseRepository, stationThresholds);
        lenient().when(stationThresholds.forStation(CACHOEIRA))
                .thenReturn(new StationThresholds("Rio Cachoeira", 2.0, 2.8, 3.5));
        lenient().when(stationThresholds.forStation(CUBATAO))
                .thenReturn(new StationThresholds("Rio Cubatao", 3.0, 4.0, 5.0));
        lenient().when(zoneService.getZones()).thenReturn(List.of(zone("central", true)));
    }

    @Test
    void tideStatusIsUnknownBeforeTideRefreshRuns() {
        scheduler.aggregateOfficialData();

        assertThat(captureZoneData().tide().status()).isEqualTo("UNKNOWN");
    }

    @Test
    void aggregationUsesNearestExtremeFromTheDailyRefresh() {
        Instant now = Instant.now();
        when(tideClient.fetchExtremes(anyInt())).thenReturn(List.of(
                new TideExtreme(now.plusSeconds(600), 1.42, TideType.HIGH),
                new TideExtreme(now.plusSeconds(30_000), 0.21, TideType.LOW)
        ));

        scheduler.refreshTideData();
        scheduler.aggregateOfficialData();

        TideData tide = captureZoneData().tide();
        assertThat(tide.status()).isEqualTo("HIGH_TIDE");
        assertThat(tide.currentLevel()).isEqualTo(1.42);
    }

    @Test
    void refreshFailureKeepsLastKnownExtremes() {
        Instant now = Instant.now();
        when(tideClient.fetchExtremes(anyInt()))
                .thenReturn(List.of(new TideExtreme(now.plusSeconds(600), 1.42, TideType.HIGH)))
                .thenThrow(new RuntimeException("worldtides down"));

        scheduler.refreshTideData();
        scheduler.refreshTideData();
        scheduler.aggregateOfficialData();

        assertThat(captureZoneData().tide().currentLevel()).isEqualTo(1.42);
    }

    @Test
    void zonesReceiveOnlyDeclaredRiverStations() throws Exception {
        Zone centro = zone("centro", true, CACHOEIRA);
        Zone oeste = zone("oeste", false);
        when(zoneService.getZones()).thenReturn(List.of(centro, oeste));
        stubRiverFetch(null, 2.5);
        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of());

        scheduler.aggregateOfficialData();

        Map<String, ZoneData> byZone = capturedZones();
        assertThat(byZone).containsOnlyKeys("centro", "oeste");

        ZoneData centroData = byZone.get("centro");
        assertThat(centroData.rivers()).extracting(RiverData::stationCode).containsExactly(CACHOEIRA);
        assertThat(centroData.tide()).isNotNull();
        assertThat(centroData.civilDefense().riskLevel()).isEqualTo(CivilDefenseRiskLevel.NONE);

        ZoneData oesteData = byZone.get("oeste");
        assertThat(oesteData.rivers()).isEmpty();
        assertThat(oesteData.tide()).isNull();
    }

    @Test
    void classifiesRiverStatusAtEachThresholdAndNull() throws Exception {
        Zone centro = zone("centro", true, CACHOEIRA);
        when(zoneService.getZones()).thenReturn(List.of(centro));
        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of());

        assertThat(runSingleZone(centro, null).rivers().get(0).status()).isEqualTo(RiverStatus.UNKNOWN);
        assertThat(runSingleZone(centro, 1.9).rivers().get(0).status()).isEqualTo(RiverStatus.NORMAL);
        assertThat(runSingleZone(centro, 2.0).rivers().get(0).status()).isEqualTo(RiverStatus.ATTENTION);
        assertThat(runSingleZone(centro, 2.8).rivers().get(0).status()).isEqualTo(RiverStatus.ALERT);
        assertThat(runSingleZone(centro, 3.5).rivers().get(0).status()).isEqualTo(RiverStatus.OVERFLOW);
    }

    @Test
    void marksDeclaredStationUnknownWhenReadingIsMissing() throws Exception {
        Zone centro = zone("centro", true, CACHOEIRA);
        when(zoneService.getZones()).thenReturn(List.of(centro));
        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of());

        ZoneData data = runSingleZone(centro, null);

        assertThat(data.rivers()).hasSize(1);
        assertThat(data.rivers().get(0).level()).isNull();
        assertThat(data.rivers().get(0).status()).isEqualTo(RiverStatus.UNKNOWN);
        assertThat(data.rivers().get(0).stationCode()).isEqualTo(CACHOEIRA);
    }

    @Test
    void computesOverallStatusAsWorstSource() throws Exception {
        Zone centro = zone("centro", true, CACHOEIRA);
        when(zoneService.getZones()).thenReturn(List.of(centro));

        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of(notice(CivilDefenseRiskLevel.ALERT)));
        assertThat(runSingleZone(centro, 3.5).overallStatus()).isEqualTo(OverallStatus.CRITICAL);
        assertThat(runSingleZone(centro, 2.8).overallStatus()).isEqualTo(OverallStatus.ALERT);

        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of());
        assertThat(runSingleZone(centro, 1.0).overallStatus()).isEqualTo(OverallStatus.NORMAL);
        assertThat(runSingleZone(centro, null).overallStatus()).isEqualTo(OverallStatus.NORMAL);

        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of(notice(CivilDefenseRiskLevel.EMERGENCY)));
        assertThat(runSingleZone(centro, 1.0).overallStatus()).isEqualTo(OverallStatus.CRITICAL);
    }

    @Test
    void overallStatusIsUnknownWhenEverySourceIsUnknownOrAbsent() throws Exception {
        Zone oeste = zone("oeste", false);
        when(zoneService.getZones()).thenReturn(List.of(oeste));
        when(anaClient.authenticate()).thenThrow(new RuntimeException("ANA down"));
        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenThrow(new RuntimeException("DB down"));
        when(zoneService.getLastKnownRiverData("oeste")).thenReturn(List.of());
        when(zoneService.getLastKnownCivilDefenseData("oeste")).thenReturn(null);

        scheduler.aggregateOfficialData();

        ZoneData oesteData = capturedZones().get("oeste");
        assertThat(oesteData.overallStatus()).isEqualTo(OverallStatus.UNKNOWN);
        assertThat(oesteData.rivers()).isEmpty();
        assertThat(oesteData.civilDefense()).isNull();
    }

    @Test
    void fallsBackPerZoneWhenRiverSourceFails() throws Exception {
        Zone centro = zone("centro", true, CACHOEIRA);
        Zone norte = zone("norte", true, CUBATAO);
        when(zoneService.getZones()).thenReturn(List.of(centro, norte));
        when(anaClient.authenticate()).thenThrow(new RuntimeException("ANA down"));
        when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any(Instant.class)))
                .thenReturn(List.of());
        when(zoneService.getLastKnownRiverData("centro"))
                .thenReturn(List.of(new RiverData(CACHOEIRA, "Rio Cachoeira", 3.0, RiverStatus.ALERT, Instant.parse("2026-08-27T10:00:00Z"))));
        when(zoneService.getLastKnownRiverData("norte"))
                .thenReturn(List.of(new RiverData(CUBATAO, "Rio Cubatao", 1.0, RiverStatus.NORMAL, Instant.parse("2026-08-27T09:00:00Z"))));

        scheduler.aggregateOfficialData();

        Map<String, ZoneData> byZone = capturedZones();
        assertThat(byZone.get("centro").rivers()).hasSize(1);
        assertThat(byZone.get("centro").rivers().get(0).level()).isEqualTo(3.0);
        assertThat(byZone.get("centro").rivers().get(0).lastUpdate()).isEqualTo(Instant.parse("2026-08-27T10:00:00Z"));
        assertThat(byZone.get("norte").rivers()).hasSize(1);
        assertThat(byZone.get("norte").rivers().get(0).level()).isEqualTo(1.0);
        assertThat(byZone.get("norte").rivers().get(0).lastUpdate()).isEqualTo(Instant.parse("2026-08-27T09:00:00Z"));
    }

    private ZoneData captureZoneData() {
        ArgumentCaptor<ZoneData> captor = ArgumentCaptor.forClass(ZoneData.class);
        verify(zoneService, atLeastOnce()).updateZoneData(captor.capture());
        return captor.getValue();
    }

    private ZoneData runSingleZone(Zone zone, Double cachoeiraLevel) throws Exception {
        stubRiverFetch(cachoeiraLevel, null);
        scheduler.aggregateOfficialData();
        List<ZoneData> captured = captureAll();
        return captured.get(captured.size() - 1);
    }

    private List<ZoneData> captureAll() {
        ArgumentCaptor<ZoneData> captor = ArgumentCaptor.forClass(ZoneData.class);
        verify(zoneService, org.mockito.Mockito.atLeast(1)).updateZoneData(captor.capture());
        return captor.getAllValues();
    }

    private void stubRiverFetch(Double cachoeiraLevel, Double cubataoLevel) throws Exception {
        lenient().when(anaClient.authenticate()).thenReturn("token");
        lenient().when(anaClient.fetchLatestReadings(anyList(), any(String.class)))
                .thenReturn(riverResponse(cachoeiraLevel, cubataoLevel));
    }

    private JsonNode riverResponse(Double cachoeiraLevel, Double cubataoLevel) {
        ArrayNode items = objectMapper.createArrayNode();
        items.add(stationItem(CACHOEIRA, "Rio Cachoeira", cachoeiraLevel));
        items.add(stationItem(CUBATAO, "Rio Cubatao", cubataoLevel));
        ObjectNode root = objectMapper.createObjectNode();
        root.set("items", items);
        return root;
    }

    private ObjectNode stationItem(String code, String name, Double level) {
        ObjectNode item = objectMapper.createObjectNode();
        item.put("cod_estacao", code);
        item.put("nom_estacao", name);
        ArrayNode readings = item.putArray("sen_ult");
        if (level != null) {
            readings.addObject().put("vlr_obs", level);
        }
        item.put("data_ult", "2026-08-27T12:00:00Z");
        return item;
    }

    private CivilDefenseNotice notice(CivilDefenseRiskLevel riskLevel) {
        return new CivilDefenseNotice(1L, "Aviso", "resumo", "conteudo", "link", null,
                riskLevel, Instant.now(), Instant.now());
    }

    private Zone zone(String id, boolean tideAffected, String... stations) {
        return new Zone(id, id, List.of(List.of(List.of(List.of(0.0, 0.0)))), List.of(), List.of(stations), tideAffected);
    }

    private Map<String, ZoneData> capturedZones() {
        return captureAll().stream()
                .collect(Collectors.toMap(ZoneData::zoneId, Function.identity()));
    }
}