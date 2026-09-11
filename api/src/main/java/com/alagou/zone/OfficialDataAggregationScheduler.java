package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.officialdata.rain.CemadenRainClient;
import com.alagou.officialdata.rain.CemadenRainReading;
import com.alagou.officialdata.rain.ForecastRainReading;
import com.alagou.officialdata.rain.OpenMeteoRainClient;
import com.alagou.officialdata.rain.RainThresholds;
import com.alagou.officialdata.river.OpenMeteoFloodClient;
import com.alagou.officialdata.river.RiverDischargeReading;
import com.alagou.officialdata.tide.TideExtreme;
import com.alagou.officialdata.tide.TideType;
import com.alagou.officialdata.tide.WorldTidesClient;
import com.alagou.push.service.PushDispatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class OfficialDataAggregationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OfficialDataAggregationScheduler.class);
    private static final int TIDE_FORECAST_DAYS = 7;
    private static final Duration RIVER_CACHE_TTL = Duration.ofHours(1);

    private final ZoneService zoneService;
    private final CemadenRainClient cemadenClient;
    private final OpenMeteoRainClient rainForecastClient;
    private final OpenMeteoFloodClient floodClient;
    private final WorldTidesClient tideClient;
    private final CivilDefenseNoticeRepository civilDefenseRepository;
    private final RainThresholds rainThresholds;
    private final PushDispatchService pushDispatchService;

    private final Map<String, RiverData> riverCache = new HashMap<>();
    private Instant riverCacheLoadedAt;

    private volatile List<TideExtreme> cachedTideExtremes;

    public OfficialDataAggregationScheduler(
            ZoneService zoneService,
            CemadenRainClient cemadenClient,
            OpenMeteoRainClient rainForecastClient,
            OpenMeteoFloodClient floodClient,
            WorldTidesClient tideClient,
            CivilDefenseNoticeRepository civilDefenseRepository,
            RainThresholds rainThresholds,
            PushDispatchService pushDispatchService
    ) {
        this.zoneService = zoneService;
        this.cemadenClient = cemadenClient;
        this.rainForecastClient = rainForecastClient;
        this.floodClient = floodClient;
        this.tideClient = tideClient;
        this.civilDefenseRepository = civilDefenseRepository;
        this.rainThresholds = rainThresholds;
        this.pushDispatchService = pushDispatchService;
    }

    @Scheduled(fixedRate = 15, timeUnit = TimeUnit.MINUTES)
    public void aggregateOfficialData() {
        log.info("Starting official data aggregation");

        Map<String, List<CemadenRainReading>> measuredRainByZone = fetchMeasuredRainByZone();
        refreshRiverCacheIfStale();
        TideData tide = computeTide();
        CivilDefenseData civilDefense = fetchCivilDefenseData();

        for (Zone zone : zoneService.getZones()) {
            RainData rain = buildRainData(zone, measuredRainByZone.getOrDefault(zone.id(), List.of()));
            RiverData river = riverCache.containsKey(zone.id())
                    ? riverCache.get(zone.id())
                    : zoneService.getLastKnownRiverData(zone.id());
            CivilDefenseData zoneCivilDefense = civilDefense != null
                    ? civilDefense
                    : zoneService.getLastKnownCivilDefenseData(zone.id());
            TideData zoneTide = zone.tideAffected() ? tide : null;
            OverallStatus overallStatus = computeOverallStatus(rain, river, zoneCivilDefense);

            OverallStatus previousStatus = zoneService.getZoneData(zone.id())
                    .map(ZoneData::overallStatus)
                    .orElse(OverallStatus.UNKNOWN);

            ZoneData data = new ZoneData(
                    zone.id(),
                    zone.name(),
                    zone.polygon(),
                    rain,
                    river,
                    zoneTide,
                    zoneCivilDefense,
                    overallStatus,
                    Instant.now()
            );
            zoneService.updateZoneData(data);

            if (worsened(previousStatus, overallStatus)
                    && (overallStatus == OverallStatus.ALERT || overallStatus == OverallStatus.CRITICAL)) {
                pushDispatchService.publishClimatic(zone.id(), previousStatus, overallStatus);
            }
        }

        log.info("Official data aggregation completed");
    }

    private Map<String, List<CemadenRainReading>> fetchMeasuredRainByZone() {
        Map<String, List<CemadenRainReading>> byZone = new HashMap<>();
        try {
            for (CemadenRainReading reading : cemadenClient.fetchCityReadings()) {
                for (Zone zone : zonesForStation(reading.station().latitude(), reading.station().longitude())) {
                    byZone.computeIfAbsent(zone.id(), id -> new ArrayList<>()).add(reading);
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch rain data from CEMADEN", e);
            throw new IllegalStateException("Failed to fetch rain data from CEMADEN", e);
        }
        return byZone;
    }

    private RainData buildRainData(Zone zone, List<CemadenRainReading> measured) {
        GeoPoint centroid = zone.centroid();

        ForecastRainReading forecast = null;
        if (centroid != null) {
            try {
                forecast = rainForecastClient.fetchRain(centroid.latitude(), centroid.longitude());
            } catch (Exception e) {
                log.error("Failed to fetch rain forecast from Open-Meteo for zone {}", zone.id(), e);
                throw new IllegalStateException("Failed to fetch rain forecast from Open-Meteo for zone " + zone.id(), e);
            }
        }

        if (measured.isEmpty() && forecast == null) {
            return zoneService.getLastKnownRainData(zone.id());
        }

        RainWindow lastHour = RainWindow.of(
                worst(measured.stream().map(CemadenRainReading::accumulated1hMm).toList()),
                forecast != null ? forecast.accumulated1hMm() : null
        );
        RainWindow last24Hours = RainWindow.of(
                worst(measured.stream().map(CemadenRainReading::accumulated24hMm).toList()),
                forecast != null ? forecast.accumulated24hMm() : null
        );
        List<String> stationNames = measured.stream()
                .filter(reading -> reading.accumulated1hMm() != null || reading.accumulated24hMm() != null)
                .map(reading -> reading.station().name())
                .sorted()
                .toList();

        RainStatus status = classifyRainStatus(lastHour, last24Hours);
        return new RainData(lastHour, last24Hours, stationNames, status, Instant.now());
    }

    private RainStatus classifyRainStatus(RainWindow lastHour, RainWindow last24Hours) {
        RainStatus fromLastHour = classifyWindow(lastHour, rainThresholds.getLastHour());
        RainStatus fromLast24Hours = classifyWindow(last24Hours, rainThresholds.getLast24Hours());
        return rainRank(fromLastHour) >= rainRank(fromLast24Hours) ? fromLastHour : fromLast24Hours;
    }

    // O CEMADEN mede chuva de verdade no pluviômetro; a Open-Meteo modela chuva em grade e pode não
    // captar um evento convectivo localizado. Classificar pela média das duas fontes (RainWindow.averageMm,
    // mantido só para exibição) diluía uma leitura medida real perto do limiar até parecer normal, então a
    // classificação usa o pior status entre as duas fontes, no mesmo padrão "pior vence" já usado entre
    // lastHour e last24Hours logo acima
    private RainStatus classifyWindow(RainWindow window, RainThresholds.Window thresholds) {
        if (window == null || thresholds == null
                || thresholds.getAttention() == null || thresholds.getAlert() == null
                || thresholds.getCritical() == null) {
            return RainStatus.UNKNOWN;
        }

        RainStatus fromMeasured = classifyValue(window.measuredMm(), thresholds);
        RainStatus fromForecast = classifyValue(window.forecastMm(), thresholds);
        return rainRank(fromMeasured) >= rainRank(fromForecast) ? fromMeasured : fromForecast;
    }

    private RainStatus classifyValue(Double value, RainThresholds.Window thresholds) {
        if (value == null) {
            return RainStatus.UNKNOWN;
        }
        if (value >= thresholds.getCritical()) return RainStatus.CRITICAL;
        if (value >= thresholds.getAlert()) return RainStatus.ALERT;
        if (value >= thresholds.getAttention()) return RainStatus.ATTENTION;
        return RainStatus.NORMAL;
    }

    private void refreshRiverCacheIfStale() {
        if (riverCacheLoadedAt != null && riverCacheLoadedAt.isAfter(Instant.now().minus(RIVER_CACHE_TTL))) {
            return;
        }

        boolean anySucceeded = false;
        for (Zone zone : zoneService.getZones()) {
            GeoPoint samplingPoint = zone.riverSamplingPoint();
            if (samplingPoint == null) {
                continue;
            }
            try {
                RiverDischargeReading reading = floodClient.fetchDischarge(samplingPoint.latitude(), samplingPoint.longitude());
                riverCache.put(zone.id(), new RiverData(
                        reading.dischargeCubicMetersPerSecond(),
                        reading.forecastPeakCubicMetersPerSecond(),
                        classifyRiverStatus(reading),
                        reading.observedAt()
                ));
                anySucceeded = true;
            } catch (Exception e) {
                log.error("Failed to fetch river discharge from Open-Meteo Flood for zone {}", zone.id(), e);
                throw new IllegalStateException("Failed to fetch river discharge from Open-Meteo Flood for zone " + zone.id(), e);
            }
        }

        if (anySucceeded) {
            riverCacheLoadedAt = Instant.now();
        }
    }

    // A vazão do GloFAS é modelo de grade, sem calibração local: um limiar absoluto em m³/s não
    // teria significado para Joinville. A classificação usa a razão entre o pico previsto e a
    // vazão de hoje, que mede tendência de subida e independe da escala do rio
    private RiverStatus classifyRiverStatus(RiverDischargeReading reading) {
        Double current = reading.dischargeCubicMetersPerSecond();
        Double peak = reading.forecastPeakCubicMetersPerSecond();
        if (current == null || peak == null || current <= 0) {
            return RiverStatus.UNKNOWN;
        }

        double ratio = peak / current;
        if (ratio >= rainThresholds.getRiverAlertRatio()) return RiverStatus.ALERT;
        if (ratio >= rainThresholds.getRiverAttentionRatio()) return RiverStatus.ATTENTION;
        return RiverStatus.NORMAL;
    }

    private List<Zone> zonesForStation(double latitude, double longitude) {
        List<Zone> withinRadius = new ArrayList<>();
        Zone nearest = null;
        double nearestDistance = Double.MAX_VALUE;

        for (Zone zone : zoneService.getZones()) {
            GeoPoint centroid = zone.centroid();
            if (centroid == null) {
                continue;
            }
            double distance = distanceKm(latitude, longitude, centroid.latitude(), centroid.longitude());
            if (distance <= rainThresholds.getStationRadiusKm()) {
                withinRadius.add(zone);
            }
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = zone;
            }
        }

        if (withinRadius.isEmpty() && nearest != null) {
            withinRadius.add(nearest);
        }
        return withinRadius;
    }

    private static double distanceKm(double latitude1, double longitude1, double latitude2, double longitude2) {
        double deltaLatitude = Math.toRadians(latitude2 - latitude1);
        double deltaLongitude = Math.toRadians(longitude2 - longitude1);
        double a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2)
                + Math.cos(Math.toRadians(latitude1)) * Math.cos(Math.toRadians(latitude2))
                * Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);
        return 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Uma zona pode ter mais de um pluviômetro do CEMADEN atribuído (station-radius-km=5.0 pode
    // cobrir mais de um centroide). Fazer média entre as estações diluiria uma chuva forte real e
    // localizada em uma delas até parecer normal, no mesmo padrão "pior vence" usado em
    // classifyWindow entre medido e previsto
    private Double worst(List<Double> values) {
        Double worst = null;
        for (Double value : values) {
            if (value != null && (worst == null || value > worst)) {
                worst = value;
            }
        }
        return worst;
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
            throw new IllegalStateException("Failed to refresh tide forecast from WorldTides", e);
        }
    }

    private TideData computeTide() {
        List<TideExtreme> extremes = cachedTideExtremes;
        if (extremes == null || extremes.isEmpty()) {
            return new TideData(null, Instant.now(), "UNKNOWN");
        }

        Instant now = Instant.now();
        TideExtreme nearest = null;
        TideExtreme previous = null;
        TideExtreme next = null;
        double minDiff = Double.MAX_VALUE;

        for (TideExtreme extreme : extremes) {
            double diff = Math.abs(extreme.dateTime().toEpochMilli() - now.toEpochMilli());
            if (diff < minDiff) {
                minDiff = diff;
                nearest = extreme;
            }
            if (!extreme.dateTime().isAfter(now) && (previous == null || extreme.dateTime().isAfter(previous.dateTime()))) {
                previous = extreme;
            }
            if (!extreme.dateTime().isBefore(now) && (next == null || extreme.dateTime().isBefore(next.dateTime()))) {
                next = extreme;
            }
        }

        String status = nearest != null && nearest.type() == TideType.HIGH ? "HIGH_TIDE" : "LOW_TIDE";
        Double currentHeight;
        if (previous != null && next != null && !previous.dateTime().equals(next.dateTime())) {
            currentHeight = interpolateHeight(previous, next, now);
        } else {
            // agora cai fora da janela de extremos buscada (borda do cache de 7 dias): sem um extremo
            // de cada lado não dá pra interpolar, então aproxima pelo mais próximo no tempo
            currentHeight = nearest != null ? nearest.heightMeters() : null;
        }
        return new TideData(currentHeight, now, status);
    }

    private static double interpolateHeight(TideExtreme previous, TideExtreme next, Instant now) {
        double totalMillis = next.dateTime().toEpochMilli() - previous.dateTime().toEpochMilli();
        double elapsedMillis = now.toEpochMilli() - previous.dateTime().toEpochMilli();
        double fraction = elapsedMillis / totalMillis;
        return previous.heightMeters()
                + (next.heightMeters() - previous.heightMeters()) * (1 - Math.cos(Math.PI * fraction)) / 2;
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
            throw new IllegalStateException("Failed to fetch civil defense data", e);
        }
    }

    private OverallStatus computeOverallStatus(RainData rain, RiverData river, CivilDefenseData civilDefense) {
        int worst = overallRank(OverallStatus.UNKNOWN);

        if (rain != null) {
            int rank = switch (rain.status()) {
                case CRITICAL -> overallRank(OverallStatus.CRITICAL);
                case ALERT -> overallRank(OverallStatus.ALERT);
                case ATTENTION -> overallRank(OverallStatus.ATTENTION);
                case NORMAL -> overallRank(OverallStatus.NORMAL);
                case UNKNOWN -> overallRank(OverallStatus.UNKNOWN);
            };
            if (rank > worst) worst = rank;
        }

        if (river != null) {
            int rank = switch (river.status()) {
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

        // "Sem aviso da Defesa Civil" não é evidência de que a zona está bem: sem nenhuma medição
        // de chuva ou vazão, pintar a zona de NORMAL no mapa afirmaria uma segurança não verificada
        boolean measured = (rain != null && rain.status() != RainStatus.UNKNOWN)
                || (river != null && river.status() != RiverStatus.UNKNOWN);
        if (!measured && worst <= overallRank(OverallStatus.NORMAL)) {
            return OverallStatus.UNKNOWN;
        }

        return switch (worst) {
            case 4 -> OverallStatus.CRITICAL;
            case 3 -> OverallStatus.ALERT;
            case 2 -> OverallStatus.ATTENTION;
            case 1 -> OverallStatus.NORMAL;
            default -> OverallStatus.UNKNOWN;
        };
    }

    private static boolean worsened(OverallStatus before, OverallStatus after) {
        return overallRank(after) > overallRank(before);
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

    private static int rainRank(RainStatus status) {
        return switch (status) {
            case NORMAL -> 1;
            case ATTENTION -> 2;
            case ALERT -> 3;
            case CRITICAL -> 4;
            case UNKNOWN -> 0;
        };
    }
}
