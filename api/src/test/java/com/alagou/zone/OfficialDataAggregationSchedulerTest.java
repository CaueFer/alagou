package com.alagou.zone;

import com.alagou.officialdata.civildefense.CivilDefenseNewsClient;
import com.alagou.officialdata.river.AnaHidrowebClient;
import com.alagou.officialdata.tide.TideExtreme;
import com.alagou.officialdata.tide.TideType;
import com.alagou.officialdata.tide.WorldTidesClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OfficialDataAggregationSchedulerTest {

    @Mock
    private ZoneService zoneService;
    @Mock
    private AnaHidrowebClient anaClient;
    @Mock
    private WorldTidesClient tideClient;
    @Mock
    private CivilDefenseNewsClient civilDefenseClient;

    private OfficialDataAggregationScheduler scheduler;

    @BeforeEach
    void setUp() {
        scheduler = new OfficialDataAggregationScheduler(zoneService, anaClient, tideClient, civilDefenseClient);
        lenient().when(zoneService.getZones()).thenReturn(List.of(new Zone("central", "Central", List.of())));
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

    private ZoneData captureZoneData() {
        ArgumentCaptor<ZoneData> captor = ArgumentCaptor.forClass(ZoneData.class);
        verify(zoneService, atLeastOnce()).updateZoneData(captor.capture());
        return captor.getValue();
    }
}
