package com.alagou.feed;

import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.alert.service.AlertService;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.civildefense.service.CivilDefenseNoticeService;
import com.alagou.zone.RiverData;
import com.alagou.zone.OverallStatus;
import com.alagou.zone.RiverStatus;
import com.alagou.zone.Zone;
import com.alagou.zone.ZoneData;
import com.alagou.zone.ZoneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecentAlertsServiceTest {

    @Mock
    private AlertService alertService;

    @Mock
    private CivilDefenseNoticeService civilDefenseNoticeService;

    @Mock
    private ZoneService zoneService;

    private RecentAlertsService service;

    @BeforeEach
    void setUp() {
        service = new RecentAlertsService(alertService, civilDefenseNoticeService, zoneService);
    }

    @Test
    void mergesAllThreeSources() {
        Instant now = Instant.now();
        when(alertService.findAll(false, "recent")).thenReturn(List.of(userAlert(1L, now)));
        when(civilDefenseNoticeService.listNotices())
                .thenReturn(List.of(notice(2L, CivilDefenseRiskLevel.EMERGENCY, now)));
        when(zoneService.getAllZoneData()).thenReturn(List.of(zoneData(now)));
        when(zoneService.getZones()).thenReturn(List.of(zone()));

        List<RecentAlertResponse> result = service.listRecentAlerts();

        assertThat(result).hasSize(3);
        assertThat(result).extracting(RecentAlertResponse::type)
                .containsExactlyInAnyOrder(AlertType.USER, AlertType.CIVIL_DEFENSE, AlertType.CLIMATIC);

        RecentAlertResponse user = findByType(result, AlertType.USER);
        assertThat(user.userAlert()).isNotNull();
        assertThat(user.lat()).isEqualTo(-26.30);
        assertThat(user.lng()).isEqualTo(-48.85);

        RecentAlertResponse civilDefense = findByType(result, AlertType.CIVIL_DEFENSE);
        assertThat(civilDefense.civilDefenseNotice()).isNotNull();
        assertThat(civilDefense.lat()).isNull();
        assertThat(civilDefense.locationLabel()).isEqualTo("Joinville");

        RecentAlertResponse climatic = findByType(result, AlertType.CLIMATIC);
        assertThat(climatic.climaticZone()).isNotNull();
        assertThat(climatic.locationLabel()).isEqualTo("Zona Central");
        assertThat(climatic.lat()).isCloseTo(-26.305, within(1e-9));
        assertThat(climatic.lng()).isCloseTo(-48.855, within(1e-9));
    }

    @Test
    void sortsByEmittedAtDescending() {
        Instant now = Instant.now();
        when(alertService.findAll(false, "recent"))
                .thenReturn(List.of(userAlert(1L, now.minus(2, ChronoUnit.HOURS))));
        when(civilDefenseNoticeService.listNotices())
                .thenReturn(List.of(notice(2L, CivilDefenseRiskLevel.EMERGENCY, now.minus(1, ChronoUnit.HOURS))));
        when(zoneService.getAllZoneData()).thenReturn(List.of(zoneData(now)));
        when(zoneService.getZones()).thenReturn(List.of());

        List<RecentAlertResponse> result = service.listRecentAlerts();

        assertThat(result).extracting(RecentAlertResponse::type)
                .containsExactly(AlertType.CLIMATIC, AlertType.CIVIL_DEFENSE, AlertType.USER);
    }

    @Test
    void includesOnlyEmergencyCivilDefenseNotices() {
        Instant now = Instant.now();
        when(alertService.findAll(false, "recent")).thenReturn(List.of());
        when(zoneService.getAllZoneData()).thenReturn(List.of());
        when(civilDefenseNoticeService.listNotices()).thenReturn(List.of(
                notice(1L, CivilDefenseRiskLevel.ATTENTION, now),
                notice(2L, CivilDefenseRiskLevel.ALERT, now),
                notice(3L, CivilDefenseRiskLevel.EMERGENCY, now)
        ));

        List<RecentAlertResponse> result = service.listRecentAlerts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).type()).isEqualTo(AlertType.CIVIL_DEFENSE);
        assertThat(result.get(0).civilDefenseNotice().id()).isEqualTo(3L);
    }

    @Test
    void buildsPrefixedIdsPerSource() {
        Instant now = Instant.now();
        when(alertService.findAll(false, "recent")).thenReturn(List.of(userAlert(7L, now)));
        when(civilDefenseNoticeService.listNotices())
                .thenReturn(List.of(notice(9L, CivilDefenseRiskLevel.EMERGENCY, now)));
        when(zoneService.getAllZoneData()).thenReturn(List.of(zoneData(now)));
        when(zoneService.getZones()).thenReturn(List.of());

        List<RecentAlertResponse> result = service.listRecentAlerts();

        assertThat(result).extracting(RecentAlertResponse::id)
                .containsExactlyInAnyOrder("user-7", "civildefense-9", "climatic-central");
    }

    private AlertResponse userAlert(Long id, Instant creationDate) {
        return new AlertResponse(id, AlertType.USER, "maria", Severity.SEVERE, -26.30, -48.85,
                List.of(), 0, 0, creationDate.plus(3, ChronoUnit.HOURS), creationDate);
    }

    private CivilDefenseNoticeResponse notice(Long id, CivilDefenseRiskLevel riskLevel, Instant publishedAt) {
        return new CivilDefenseNoticeResponse(id, "Estado de emergência decretado", "resumo", "conteúdo",
                "link", "thumb.jpg", riskLevel, publishedAt);
    }

    private ZoneData zoneData(Instant lastUpdate) {
        return new ZoneData("central", "Zona Central",
                List.of(List.of(List.of(List.of(-48.85, -26.30)))),
                List.of(new RiverData("82274000", "Rio Cachoeira", 2.5, RiverStatus.ATTENTION, lastUpdate)),
                null, null, OverallStatus.ATTENTION, lastUpdate);
    }

    private Zone zone() {
        return new Zone("central", "Zona Central",
                List.of(List.of(List.of(List.of(-48.85, -26.30), List.of(-48.86, -26.31)))));
    }

    private RecentAlertResponse findByType(List<RecentAlertResponse> items, AlertType type) {
        return items.stream()
                .filter(item -> item.type() == type)
                .findFirst()
                .orElseThrow();
    }
}
