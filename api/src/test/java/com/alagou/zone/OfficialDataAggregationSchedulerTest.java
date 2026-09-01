package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.officialdata.rain.CemadenRainClient;
import com.alagou.officialdata.rain.CemadenRainReading;
import com.alagou.officialdata.rain.CemadenStation;
import com.alagou.officialdata.rain.ForecastRainReading;
import com.alagou.officialdata.rain.OpenMeteoRainClient;
import com.alagou.officialdata.rain.RainThresholds;
import com.alagou.officialdata.river.OpenMeteoFloodClient;
import com.alagou.officialdata.river.RiverDischargeReading;
import com.alagou.officialdata.tide.TideExtreme;
import com.alagou.officialdata.tide.TideType;
import com.alagou.officialdata.tide.WorldTidesClient;
import com.alagou.push.service.PushDispatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OfficialDataAggregationSchedulerTest {

    @Mock
    private ZoneService zoneService;

    @Mock
    private CemadenRainClient cemadenClient;

    @Mock
    private OpenMeteoRainClient rainForecastClient;

    @Mock
    private OpenMeteoFloodClient floodClient;

    @Mock
    private WorldTidesClient tideClient;

    @Mock
    private CivilDefenseNoticeRepository civilDefenseRepository;

    @Mock
    private PushDispatchService pushDispatchService;

    private RainThresholds rainThresholds;
    private OfficialDataAggregationScheduler scheduler;

    @BeforeEach
    void setUp() {
        rainThresholds = new RainThresholds();
        rainThresholds.getLastHour().setAttention(10.0);
        rainThresholds.getLastHour().setAlert(20.0);
        rainThresholds.getLastHour().setCritical(30.0);
        rainThresholds.getLast24Hours().setAttention(50.0);
        rainThresholds.getLast24Hours().setAlert(80.0);
        rainThresholds.getLast24Hours().setCritical(100.0);
        rainThresholds.setStationRadiusKm(5.0);

        scheduler = new OfficialDataAggregationScheduler(zoneService, cemadenClient, rainForecastClient,
                floodClient, tideClient, civilDefenseRepository, rainThresholds, pushDispatchService);
    }

    private Zone zone(String id, double lat, double lng, boolean tideAffected) {
        List<List<List<List<Double>>>> polygon = List.of(List.of(List.of(
                List.of(lng, lat), List.of(lng, lat), List.of(lng, lat), List.of(lng, lat))));
        return new Zone(id, id, polygon, List.of(), null, tideAffected);
    }

    private void withZones(Zone... zones) {
        when(zoneService.getZones()).thenReturn(List.of(zones));
    }

    private void quietSources() {
        lenient().doReturn(List.of()).when(cemadenClient).fetchCityReadings();
        lenient().doReturn(null)
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());
        lenient().doReturn(new RiverDischargeReading(null, null, Instant.now()))
                .when(floodClient).fetchDischarge(anyDouble(), anyDouble());
        lenient().when(civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(any()))
                .thenReturn(List.of());
        lenient().when(zoneService.getLastKnownRainData(anyString())).thenReturn(
                new RainData(RainWindow.of(null, null), RainWindow.of(null, null), List.of(),
                        RainStatus.UNKNOWN, Instant.now()));
        lenient().when(zoneService.getLastKnownRiverData(anyString())).thenReturn(
                new RiverData(null, null, RiverStatus.UNKNOWN, Instant.now()));
        lenient().when(zoneService.getLastKnownCivilDefenseData(anyString())).thenReturn(
                new CivilDefenseData(CivilDefenseRiskLevel.NONE, List.of(), Instant.now()));
        lenient().when(zoneService.getZoneData(anyString())).thenReturn(Optional.empty());
    }

    private Map<String, ZoneData> runAggregation() {
        scheduler.aggregateOfficialData();
        ArgumentCaptor<ZoneData> captor = ArgumentCaptor.forClass(ZoneData.class);
        verify(zoneService, atLeastOnce()).updateZoneData(captor.capture());
        return captor.getAllValues().stream()
                .collect(Collectors.toMap(ZoneData::zoneId, Function.identity(), (a, b) -> b));
    }

    private CemadenRainReading reading(String name, double lat, double lng, Double mm1h, Double mm24h) {
        return new CemadenRainReading(new CemadenStation(name.hashCode(), name, lat, lng),
                mm1h, mm1h, mm24h, Instant.now());
    }

    @Test
    void tideStatusIsUnknownBeforeTideRefreshRuns() {
        withZones(zone("centro", -26.30, -48.84, true));
        quietSources();

        ZoneData centro = runAggregation().get("centro");

        assertThat(centro.tide().status()).isEqualTo("UNKNOWN");
    }

    @Test
    void aggregationUsesNearestExtremeFromTheDailyRefresh() {
        withZones(zone("centro", -26.30, -48.84, true));
        quietSources();
        Instant now = Instant.now();
        when(tideClient.fetchExtremes(anyInt())).thenReturn(List.of(
                new TideExtreme(now.plusSeconds(600), 1.8, TideType.HIGH),
                new TideExtreme(now.plusSeconds(40000), 0.3, TideType.LOW)
        ));

        scheduler.refreshTideData();
        ZoneData centro = runAggregation().get("centro");

        assertThat(centro.tide().status()).isEqualTo("HIGH_TIDE");
        assertThat(centro.tide().nearestExtremeHeightMeters()).isEqualTo(1.8);
    }

    @Test
    void tideRefreshFailurePropagatesButKeepsLastKnownExtremes() {
        withZones(zone("centro", -26.30, -48.84, true));
        quietSources();
        Instant now = Instant.now();
        when(tideClient.fetchExtremes(anyInt()))
                .thenReturn(List.of(new TideExtreme(now.plusSeconds(600), 1.8, TideType.HIGH)))
                .thenThrow(new IllegalStateException("WorldTides fora do ar"));

        scheduler.refreshTideData();
        assertThatThrownBy(() -> scheduler.refreshTideData())
                .isInstanceOf(IllegalStateException.class);
        ZoneData centro = runAggregation().get("centro");

        assertThat(centro.tide().nearestExtremeHeightMeters()).isEqualTo(1.8);
    }

    @Test
    void assignsRainStationOnlyToZonesWithinRadius() {
        withZones(zone("centro", -26.30, -48.84, false), zone("oeste", -26.30, -48.99, false));
        quietSources();
        doReturn(List.of(
                reading("Centro", -26.301, -48.841, 1.0, 4.0),
                reading("Estrada Geral Salto I", -26.296, -48.988, 2.0, 8.0)
        )).when(cemadenClient).fetchCityReadings();

        Map<String, ZoneData> zones = runAggregation();

        assertThat(zones.get("centro").rain().stationNames()).containsExactly("Centro");
        assertThat(zones.get("oeste").rain().stationNames()).containsExactly("Estrada Geral Salto I");
    }

    @Test
    void assignsRainStationToEveryZoneWhoseCentroidIsWithinRadius() {
        withZones(zone("centro", -26.300, -48.845, false), zone("distrito-industrial", -26.270, -48.845, false));
        quietSources();
        doReturn(List.of(
                reading("Costa e Silva", -26.285, -48.845, 3.0, 12.0)
        )).when(cemadenClient).fetchCityReadings();

        Map<String, ZoneData> zones = runAggregation();

        assertThat(zones.get("centro").rain().stationNames()).containsExactly("Costa e Silva");
        assertThat(zones.get("distrito-industrial").rain().stationNames()).containsExactly("Costa e Silva");
    }

    @Test
    void fallsBackToNearestZoneWhenStationIsOutsideEveryRadius() {
        withZones(zone("centro", -26.30, -48.84, false), zone("pirabeiraba", -26.18, -48.91, false));
        quietSources();
        doReturn(List.of(
                reading("Pirabeiraba", -26.25, -48.90, 4.0, 16.0)
        )).when(cemadenClient).fetchCityReadings();

        Map<String, ZoneData> zones = runAggregation();

        assertThat(zones.get("pirabeiraba").rain().stationNames()).containsExactly("Pirabeiraba");
        assertThat(zones.get("centro").rain().stationNames()).isEmpty();
    }

    @Test
    void averagesMeasuredAndForecastRain() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(List.of(
                reading("Centro", -26.301, -48.841, 4.0, 40.0),
                reading("Costa e Silva", -26.279, -48.865, 6.0, 60.0)
        )).when(cemadenClient).fetchCityReadings();
        doReturn(new ForecastRainReading(10.0, 30.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        RainData rain = runAggregation().get("centro").rain();

        assertThat(rain.lastHour().measuredMm()).isEqualTo(5.0);
        assertThat(rain.lastHour().forecastMm()).isEqualTo(10.0);
        assertThat(rain.lastHour().averageMm()).isEqualTo(7.5);
        assertThat(rain.last24Hours().averageMm()).isEqualTo(40.0);
    }

    @Test
    void averageFallsBackToTheSurvivingSourceWhenTheOtherIsMissing() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(List.of(
                reading("Centro", -26.301, -48.841, null, null)
        )).when(cemadenClient).fetchCityReadings();
        doReturn(new ForecastRainReading(12.0, 55.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        RainData rain = runAggregation().get("centro").rain();

        assertThat(rain.lastHour().measuredMm()).isNull();
        assertThat(rain.lastHour().averageMm()).isEqualTo(12.0);
        assertThat(rain.stationNames()).isEmpty();
    }

    @Test
    void classifiesRainStatusAtEachThreshold() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();

        doReturn(new ForecastRainReading(5.0, 5.0, Instant.now()),
                new ForecastRainReading(10.0, 5.0, Instant.now()),
                new ForecastRainReading(20.0, 5.0, Instant.now()),
                new ForecastRainReading(30.0, 5.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        assertThat(runAggregation().get("centro").rain().status()).isEqualTo(RainStatus.NORMAL);
        assertThat(runAggregation().get("centro").rain().status()).isEqualTo(RainStatus.ATTENTION);
        assertThat(runAggregation().get("centro").rain().status()).isEqualTo(RainStatus.ALERT);
        assertThat(runAggregation().get("centro").rain().status()).isEqualTo(RainStatus.CRITICAL);
    }

    @Test
    void rainStatusTakesTheWorstOfBothWindows() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(new ForecastRainReading(1.0, 90.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        assertThat(runAggregation().get("centro").rain().status()).isEqualTo(RainStatus.ALERT);
    }

    @Test
    void classifiesRiverStatusFromTheForecastPeakRatio() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(new RiverDischargeReading(1.0, 3.5, Instant.now()))
                .when(floodClient).fetchDischarge(anyDouble(), anyDouble());

        RiverData river = runAggregation().get("centro").river();

        assertThat(river.status()).isEqualTo(RiverStatus.ALERT);
        assertThat(river.dischargeCubicMetersPerSecond()).isEqualTo(1.0);
        assertThat(river.forecastPeakCubicMetersPerSecond()).isEqualTo(3.5);
    }

    @Test
    void riverStatusIsUnknownWithoutDischarge() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(new RiverDischargeReading(null, null, Instant.now()))
                .when(floodClient).fetchDischarge(anyDouble(), anyDouble());

        assertThat(runAggregation().get("centro").river().status()).isEqualTo(RiverStatus.UNKNOWN);
    }

    @Test
    void computesOverallStatusAsWorstSource() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(new ForecastRainReading(12.0, 5.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());
        doReturn(List.of(notice(CivilDefenseRiskLevel.EMERGENCY)))
                .when(civilDefenseRepository).findByPublishedAtAfterOrderByPublishedAtDesc(any());

        assertThat(runAggregation().get("centro").overallStatus()).isEqualTo(OverallStatus.CRITICAL);
    }

    @Test
    void overallStatusIsUnknownWhenEverySourceIsUnknownOrAbsent() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();

        assertThat(runAggregation().get("centro").overallStatus()).isEqualTo(OverallStatus.UNKNOWN);
    }

    @Test
    void zoneWithoutAnyMeasurementIsNotReportedAsNormal() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(List.of()).when(civilDefenseRepository).findByPublishedAtAfterOrderByPublishedAtDesc(any());

        ZoneData centro = runAggregation().get("centro");

        assertThat(centro.civilDefense().riskLevel()).isEqualTo(CivilDefenseRiskLevel.NONE);
        assertThat(centro.overallStatus()).isEqualTo(OverallStatus.UNKNOWN);
    }

    @Test
    void civilDefenseStillEscalatesAZoneWithoutMeasurements() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(List.of(notice(CivilDefenseRiskLevel.ALERT)))
                .when(civilDefenseRepository).findByPublishedAtAfterOrderByPublishedAtDesc(any());

        assertThat(runAggregation().get("centro").overallStatus()).isEqualTo(OverallStatus.ALERT);
    }

    @Test
    void reportsNormalOnceThereIsAMeasurement() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        doReturn(new ForecastRainReading(0.0, 0.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        assertThat(runAggregation().get("centro").overallStatus()).isEqualTo(OverallStatus.NORMAL);
    }

    @Test
    void aggregationFailsWhenARainSourceIsDown() {
        quietSources();
        doThrow(new IllegalStateException("CEMADEN fora do ar")).when(cemadenClient).fetchCityReadings();

        assertThatThrownBy(() -> scheduler.aggregateOfficialData())
                .isInstanceOf(IllegalStateException.class);
        verify(zoneService, never()).updateZoneData(any());
    }

    @Test
    void doesNotAttachTideToZonesNotAffectedByIt() {
        withZones(zone("oeste", -26.30, -48.99, false));
        quietSources();

        assertThat(runAggregation().get("oeste").tide()).isNull();
    }

    @Test
    void publishesClimaticPushWhenZoneStatusWorsensIntoCritical() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        lenient().when(zoneService.getZoneData("centro")).thenReturn(Optional.of(new ZoneData(
                "centro", "centro", List.of(), null, null, null, null, OverallStatus.ALERT, Instant.now())));
        doReturn(new ForecastRainReading(30.0, 5.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        scheduler.aggregateOfficialData();

        verify(pushDispatchService).publishClimatic("centro", OverallStatus.ALERT, OverallStatus.CRITICAL);
    }

    @Test
    void doesNotPublishClimaticPushWhenStatusDoesNotWorsen() {
        withZones(zone("centro", -26.30, -48.84, false));
        quietSources();
        lenient().when(zoneService.getZoneData("centro")).thenReturn(Optional.of(new ZoneData(
                "centro", "centro", List.of(), null, null, null, null, OverallStatus.CRITICAL, Instant.now())));
        doReturn(new ForecastRainReading(30.0, 5.0, Instant.now()))
                .when(rainForecastClient).fetchRain(anyDouble(), anyDouble());

        scheduler.aggregateOfficialData();

        verify(pushDispatchService, never()).publishClimatic(anyString(), any(), any());
    }

    private CivilDefenseNotice notice(CivilDefenseRiskLevel riskLevel) {
        return new CivilDefenseNotice(1L, "Aviso", "resumo", "conteudo", "link", null,
                riskLevel, Instant.now(), Instant.now());
    }
}
