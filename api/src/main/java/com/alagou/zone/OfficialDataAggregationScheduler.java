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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class OfficialDataAggregationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OfficialDataAggregationScheduler.class);
    private static final List<String> RIVER_STATIONS = List.of("82274000", "82270060");
    private static final int TIDE_FORECAST_DAYS = 7;

    private final ZoneService zoneService;
    private final AnaHidrowebClient anaClient;
    private final WorldTidesClient tideClient;
    private final CivilDefenseNoticeRepository civilDefenseRepository;
    private final AnaStationThresholds stationThresholds;

    private String anaToken;
    private Instant anaTokenExpiresAt;

    private volatile List<TideExtreme> cachedTideExtremes;

    public OfficialDataAggregationScheduler(
            ZoneService zoneService,
            AnaHidrowebClient anaClient,
            WorldTidesClient tideClient,
            CivilDefenseNoticeRepository civilDefenseRepository,
            AnaStationThresholds stationThresholds
    ) {
        this.zoneService = zoneService;
        this.anaClient = anaClient;
        this.tideClient = tideClient;
        this.civilDefenseRepository = civilDefenseRepository;
        this.stationThresholds = stationThresholds;
    }

    @Scheduled(fixedRate = 15, timeUnit = TimeUnit.MINUTES)
    public void aggregateOfficialData() {
        log.info("Starting official data aggregation");

        List<RiverData> rivers = fetchRiverData();
        TideData tide = computeTide();
        CivilDefenseData civilDefense = fetchCivilDefenseData();

        for (Zone zone : zoneService.getZones()) {
            List<RiverData> zoneRivers = riversForZone(zone, rivers);
            CivilDefenseData zoneCivilDefense = civilDefense != null
                    ? civilDefense
                    : zoneService.getLastKnownCivilDefenseData(zone.id());
            TideData zoneTide = zone.tideAffected() ? tide : null;
            OverallStatus overallStatus = computeOverallStatus(zoneRivers, zoneCivilDefense);

            ZoneData data = new ZoneData(
                    zone.id(),
                    zone.name(),
                    zone.polygon(),
                    zoneRivers,
                    zoneTide,
                    zoneCivilDefense,
                    overallStatus,
                    Instant.now()
            );
            zoneService.updateZoneData(data);
        }

        log.info("Official data aggregation completed");
    }

    private List<RiverData> fetchRiverData() {
        try {
            if (anaToken == null || Instant.now().isAfter(anaTokenExpiresAt)) {
                anaToken = anaClient.authenticate();
                anaTokenExpiresAt = Instant.now().plusSeconds(3600);
            }

            JsonNode response = anaClient.fetchLatestReadings(RIVER_STATIONS, anaToken);
            return parseRiverData(response);
        } catch (Exception e) {
            log.error("Failed to fetch river data from ANA", e);
            return null;
        }
    }

    private List<RiverData> parseRiverData(JsonNode response) {
        List<RiverData> rivers = new ArrayList<>();

        if (response == null || !response.has("items")) {
            return rivers;
        }

        JsonNode items = response.path("items");
        for (JsonNode item : items) {
            String stationCode = item.path("cod_estacao").asText();
            String stationName = item.path("nom_estacao").asText("Unknown");
            JsonNode readings = item.path("sen_ult");

            Double level = readings != null && readings.isArray() && !readings.isEmpty()
                    ? readings.get(0).path("vlr_obs").asDouble()
                    : null;

            Instant lastUpdate = item.path("data_ult").asText() != null
                    ? Instant.parse(item.path("data_ult").asText())
                    : Instant.now();

            rivers.add(new RiverData(stationCode, stationName, level, lastUpdate));
        }

        return rivers;
    }

    private List<RiverData> riversForZone(Zone zone, List<RiverData> fetched) {
        List<RiverData> source;
        if (fetched != null) {
            source = fetched.stream()
                    .filter(river -> zone.riverStations().contains(river.stationCode()))
                    .toList();
        } else {
            source = zoneService.getLastKnownRiverData(zone.id());
        }

        Map<String, RiverData> byStationCode = source.stream()
                .collect(Collectors.toMap(RiverData::stationCode, river -> river, (first, second) -> first));

        List<RiverData> result = new ArrayList<>();
        for (String stationCode : zone.riverStations()) {
            RiverData known = byStationCode.get(stationCode);
            result.add(known != null ? withStatus(known) : unknownReading(stationCode));
        }
        return result;
    }

    private RiverData unknownReading(String stationCode) {
        StationThresholds thresholds = stationThresholds.forStation(stationCode);
        String name = thresholds != null && thresholds.getName() != null ? thresholds.getName() : "Unknown";
        return new RiverData(stationCode, name, null, RiverStatus.UNKNOWN, Instant.now());
    }

    private RiverData withStatus(RiverData river) {
        return new RiverData(
                river.stationCode(),
                river.stationName(),
                river.level(),
                classifyRiverStatus(river.level(), river.stationCode()),
                river.lastUpdate()
        );
    }

    private RiverStatus classifyRiverStatus(Double level, String stationCode) {
        if (level == null) {
            return RiverStatus.UNKNOWN;
        }

        StationThresholds thresholds = stationThresholds.forStation(stationCode);
        if (thresholds == null || thresholds.getAttention() == null
                || thresholds.getAlert() == null || thresholds.getOverflow() == null) {
            return RiverStatus.UNKNOWN;
        }

        if (level >= thresholds.getOverflow()) return RiverStatus.OVERFLOW;
        if (level >= thresholds.getAlert()) return RiverStatus.ALERT;
        if (level >= thresholds.getAttention()) return RiverStatus.ATTENTION;
        return RiverStatus.NORMAL;
    }

    @Scheduled(initialDelay = 0, fixedRate = 1, timeUnit = TimeUnit.DAYS)
    public void refreshTideData() {
        log.info("Refreshing tide forecast from WorldTides");
        try {
            List<TideExtreme> extremes = tideClient.fetchExtremes(TIDE_FORECAST_DAYS);
            if (!extremes.isEmpty()) {
                cachedTideExtremes = extremes;
            }
        } catch (Exception e) {
            log.error("Failed to refresh tide forecast from WorldTides", e);
        }
    }

    private TideData computeTide() {
        List<TideExtreme> extremes = cachedTideExtremes;
        if (extremes == null || extremes.isEmpty()) {
            return new TideData(null, Instant.now(), "UNKNOWN");
        }

        Instant now = Instant.now();
        TideExtreme nearest = null;
        double minDiff = Double.MAX_VALUE;

        for (TideExtreme extreme : extremes) {
            double diff = Math.abs(extreme.dateTime().toEpochMilli() - now.toEpochMilli());
            if (diff < minDiff) {
                minDiff = diff;
                nearest = extreme;
            }
        }

        String status = nearest != null && nearest.type() == TideType.HIGH ? "HIGH_TIDE" : "LOW_TIDE";
        return new TideData(nearest != null ? nearest.heightMeters() : null, now, status);
    }

    private CivilDefenseData fetchCivilDefenseData() {
        try {
            Instant since = Instant.now().minusSeconds(86400);
            List<CivilDefenseNotice> notices = civilDefenseRepository.findByPublishedAtAfterOrderByPublishedAtDesc(since);

            List<String> recentAlerts = notices.stream()
                    .map(CivilDefenseNotice::getTitle)
                    .limit(5)
                    .toList();

            CivilDefenseRiskLevel riskLevel = notices.stream()
                    .map(CivilDefenseNotice::getRiskLevel)
                    .max(Comparator.comparingInt(CivilDefenseRiskLevel::ordinal))
                    .orElse(CivilDefenseRiskLevel.NONE);

            Instant lastUpdate = notices.isEmpty() ? Instant.now() : notices.get(0).getPublishedAt();

            return new CivilDefenseData(riskLevel, recentAlerts, lastUpdate);
        } catch (Exception e) {
            log.error("Failed to fetch civil defense data", e);
            return null;
        }
    }

    private OverallStatus computeOverallStatus(List<RiverData> rivers, CivilDefenseData civilDefense) {
        int worst = overallRank(OverallStatus.UNKNOWN);

        for (RiverData river : rivers) {
            int rank = switch (river.status()) {
                case OVERFLOW -> overallRank(OverallStatus.CRITICAL);
                case ALERT -> overallRank(OverallStatus.ALERT);
                case ATTENTION -> overallRank(OverallStatus.ATTENTION);
                case NORMAL -> overallRank(OverallStatus.NORMAL);
                case UNKNOWN -> overallRank(OverallStatus.UNKNOWN);
            };
            if (rank > worst) worst = rank;
        }

        if (civilDefense != null) {
            int rank = switch (civilDefense.riskLevel()) {
                case EMERGENCY -> overallRank(OverallStatus.CRITICAL);
                case ALERT -> overallRank(OverallStatus.ALERT);
                case ATTENTION -> overallRank(OverallStatus.ATTENTION);
                case NONE -> overallRank(OverallStatus.NORMAL);
            };
            if (rank > worst) worst = rank;
        }

        return switch (worst) {
            case 4 -> OverallStatus.CRITICAL;
            case 3 -> OverallStatus.ALERT;
            case 2 -> OverallStatus.ATTENTION;
            case 1 -> OverallStatus.NORMAL;
            default -> OverallStatus.UNKNOWN;
        };
    }

    private static int overallRank(OverallStatus status) {
        return switch (status) {
            case NORMAL -> 1;
            case ATTENTION -> 2;
            case ALERT -> 3;
            case CRITICAL -> 4;
            case UNKNOWN -> 0;
        };
    }
}