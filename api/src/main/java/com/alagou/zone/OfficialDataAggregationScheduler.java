package com.alagou.zone;

import com.alagou.officialdata.civildefense.CivilDefenseNewsClient;
import com.alagou.officialdata.civildefense.CivilDefenseNewsItem;
import com.alagou.officialdata.river.AnaHidrowebClient;
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
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class OfficialDataAggregationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OfficialDataAggregationScheduler.class);
    private static final List<String> RIVER_STATIONS = List.of("82274000", "82270060");
    private static final String CIVIL_DEFENSE_KEYWORD = "alagamento";

    private final ZoneService zoneService;
    private final AnaHidrowebClient anaClient;
    private final WorldTidesClient tideClient;
    private final CivilDefenseNewsClient civilDefenseClient;

    private String anaToken;
    private Instant anaTokenExpiresAt;

    public OfficialDataAggregationScheduler(
            ZoneService zoneService,
            AnaHidrowebClient anaClient,
            WorldTidesClient tideClient,
            CivilDefenseNewsClient civilDefenseClient
    ) {
        this.zoneService = zoneService;
        this.anaClient = anaClient;
        this.tideClient = tideClient;
        this.civilDefenseClient = civilDefenseClient;
    }

    @Scheduled(fixedRate = 5, timeUnit = TimeUnit.MINUTES)
    public void aggregateOfficialData() {
        log.info("Starting official data aggregation");

        List<RiverData> rivers = fetchRiverData();
        TideData tide = fetchTideData();
        CivilDefenseData civilDefense = fetchCivilDefenseData();

        for (Zone zone : zoneService.getZones()) {
            ZoneData data = new ZoneData(
                    zone.id(),
                    zone.name(),
                    rivers,
                    tide,
                    civilDefense,
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
            return getLastKnownRiverData();
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

    private List<RiverData> getLastKnownRiverData() {
        return zoneService.getAllZoneData().stream()
                .findFirst()
                .map(ZoneData::rivers)
                .orElse(List.of());
    }

    private TideData fetchTideData() {
        try {
            List<TideExtreme> extremes = tideClient.fetchExtremes(1);

            if (extremes.isEmpty()) {
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
        } catch (Exception e) {
            log.error("Failed to fetch tide data from WorldTides", e);
            return getLastKnownTideData();
        }
    }

    private TideData getLastKnownTideData() {
        return zoneService.getAllZoneData().stream()
                .findFirst()
                .map(ZoneData::tide)
                .orElse(new TideData(null, Instant.now(), "UNKNOWN"));
    }

    private CivilDefenseData fetchCivilDefenseData() {
        try {
            List<CivilDefenseNewsItem> items = civilDefenseClient.searchRecent(CIVIL_DEFENSE_KEYWORD, 10);

            List<String> recentAlerts = items.stream()
                    .map(CivilDefenseNewsItem::title)
                    .limit(5)
                    .toList();

            int alertLevel = calculateAlertLevel(items);
            Instant lastUpdate = items.isEmpty() ? Instant.now() : items.get(0).publishedAt();

            return new CivilDefenseData(alertLevel, recentAlerts, lastUpdate);
        } catch (Exception e) {
            log.error("Failed to fetch civil defense data", e);
            return getLastKnownCivilDefenseData();
        }
    }

    private int calculateAlertLevel(List<CivilDefenseNewsItem> items) {
        if (items.isEmpty()) {
            return 0;
        }

        long recentCount = items.stream()
                .filter(item -> item.publishedAt().isAfter(Instant.now().minusSeconds(86400)))
                .count();

        if (recentCount >= 5) return 3;
        if (recentCount >= 2) return 2;
        if (recentCount >= 1) return 1;
        return 0;
    }

    private CivilDefenseData getLastKnownCivilDefenseData() {
        return zoneService.getAllZoneData().stream()
                .findFirst()
                .map(ZoneData::civilDefense)
                .orElse(new CivilDefenseData(0, List.of(), Instant.now()));
    }
}
