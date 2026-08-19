package com.alagou.feed;

import com.alagou.alert.AlertType;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.alert.service.AlertService;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.service.CivilDefenseNoticeService;
import com.alagou.zone.RiverData;
import com.alagou.zone.TideData;
import com.alagou.zone.Zone;
import com.alagou.zone.ZoneData;
import com.alagou.zone.ZoneService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RecentAlertsService {

    private final AlertService alertService;
    private final CivilDefenseNoticeService civilDefenseNoticeService;
    private final ZoneService zoneService;

    public RecentAlertsService(
            AlertService alertService,
            CivilDefenseNoticeService civilDefenseNoticeService,
            ZoneService zoneService
    ) {
        this.alertService = alertService;
        this.civilDefenseNoticeService = civilDefenseNoticeService;
        this.zoneService = zoneService;
    }

    public List<RecentAlertResponse> listRecentAlerts() {
        List<RecentAlertResponse> items = new ArrayList<>();
        items.addAll(userAlerts());
        items.addAll(civilDefenseAlerts());
        items.addAll(climaticAlerts());
        items.sort(Comparator.comparing(RecentAlertResponse::emittedAt).reversed());
        return items;
    }

    private List<RecentAlertResponse> userAlerts() {
        return alertService.findAll(false, "recent").stream()
                .filter(alert -> alert.type() == AlertType.USER)
                .map(alert -> new RecentAlertResponse(
                        "user-" + alert.id(),
                        AlertType.USER,
                        userSummary(alert),
                        alert.lat(),
                        alert.lng(),
                        "Local do relato",
                        alert.creationDate(),
                        alert,
                        null,
                        null
                ))
                .toList();
    }

    private List<RecentAlertResponse> civilDefenseAlerts() {
        return civilDefenseNoticeService.listNotices().stream()
                .filter(notice -> notice.riskLevel() == CivilDefenseRiskLevel.EMERGENCY)
                .map(notice -> new RecentAlertResponse(
                        "civildefense-" + notice.id(),
                        AlertType.CIVIL_DEFENSE,
                        notice.title(),
                        null,
                        null,
                        "Joinville",
                        notice.publishedAt(),
                        null,
                        notice,
                        null
                ))
                .toList();
    }

    private List<RecentAlertResponse> climaticAlerts() {
        return zoneService.getAllZoneData().stream()
                .filter(this::hasClimaticData)
                .map(this::toClimaticAlert)
                .toList();
    }

    private boolean hasClimaticData(ZoneData zoneData) {
        boolean hasRivers = zoneData.rivers() != null && !zoneData.rivers().isEmpty();
        return hasRivers || zoneData.tide() != null;
    }

    private RecentAlertResponse toClimaticAlert(ZoneData zoneData) {
        Double lat = null;
        Double lng = null;
        Zone zone = zoneService.getZones().stream()
                .filter(z -> z.id().equals(zoneData.zoneId()))
                .findFirst()
                .orElse(null);
        if (zone != null) {
            double[] centroid = centroid(zone);
            if (centroid != null) {
                lat = centroid[0];
                lng = centroid[1];
            }
        }
        return new RecentAlertResponse(
                "climatic-" + zoneData.zoneId(),
                AlertType.CLIMATIC,
                climaticSummary(zoneData),
                lat,
                lng,
                zoneData.zoneName(),
                zoneData.lastUpdate(),
                null,
                null,
                zoneData
        );
    }

    private double[] centroid(Zone zone) {
        if (zone.polygon() == null || zone.polygon().isEmpty() || zone.polygon().get(0).isEmpty()) {
            return null;
        }
        List<List<Double>> ring = zone.polygon().get(0);
        double sumLat = 0;
        double sumLng = 0;
        for (List<Double> point : ring) {
            sumLng += point.get(0);
            sumLat += point.get(1);
        }
        return new double[]{sumLat / ring.size(), sumLng / ring.size()};
    }

    private String userSummary(AlertResponse alert) {
        String severityLabel = switch (alert.severity()) {
            case MODERATE -> "Alagamento moderado";
            case SEVERE -> "Alagamento grave";
            case CRITICAL -> "Alagamento crítico";
        };
        return severityLabel + " relatado por " + alert.username();
    }

    private String climaticSummary(ZoneData zoneData) {
        if (zoneData.rivers() != null) {
            RiverData river = zoneData.rivers().stream()
                    .filter(r -> r.level() != null)
                    .findFirst()
                    .orElse(null);
            if (river != null) {
                return "Rio " + river.stationName() + ": " + river.level() + "m";
            }
        }
        TideData tide = zoneData.tide();
        if (tide != null && tide.currentLevel() != null) {
            return "Maré: " + tide.currentLevel() + "m";
        }
        return "Dados climáticos atualizados";
    }
}
