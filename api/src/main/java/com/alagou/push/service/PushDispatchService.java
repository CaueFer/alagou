package com.alagou.push.service;

import com.alagou.alert.Alert;
import com.alagou.alert.Severity;
import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.push.PushCategory;
import com.alagou.push.PushEventType;
import com.alagou.push.PushOutbox;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dao.PushOutboxRepository;
import com.alagou.push.dto.PushPayload;
import com.alagou.zone.OverallStatus;
import com.alagou.zone.Zone;
import com.alagou.zone.ZoneService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class PushDispatchService {

    private static final Logger log = LoggerFactory.getLogger(PushDispatchService.class);

    private final PushOutboxRepository outboxRepository;
    private final ZoneService zoneService;
    private final PushProperties properties;
    private final ObjectMapper objectMapper;

    public PushDispatchService(PushOutboxRepository outboxRepository,
                               ZoneService zoneService,
                               PushProperties properties,
                               ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.zoneService = zoneService;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public void publishUserAlert(Alert alert) {
        if (!enabled()) {
            return;
        }

        String dedupKey = "user-alert:" + alert.getId();
        PushPayload payload = new PushPayload(
                "Novo alerta de alagamento em Joinville",
                "Um relato de alagamento " + severityLabel(alert.getSeverity()) + " foi publicado.",
                "/",
                dedupKey,
                PushCategory.NEARBY
        );
        publish(PushEventType.USER_ALERT, PushCategory.NEARBY, dedupKey, payload);
    }

    public void publishClimatic(String zoneId, OverallStatus fromStatus, OverallStatus toStatus) {
        if (!enabled()) {
            return;
        }

        Instant now = Instant.now();
        String dedupPrefix = "climatic:" + zoneId + ":";
        Instant cooldownSince = now.minus(properties.getClimaticCooldownMinutes(), ChronoUnit.MINUTES);
        if (outboxRepository.existsRecentWithDedupPrefix(PushEventType.CLIMATIC, dedupPrefix, cooldownSince)) {
            log.debug("Climatic push for zone {} suppressed by cooldown", zoneId);
            return;
        }

        long hourBucket = now.getEpochSecond() / 3600;
        String dedupKey = dedupPrefix + toStatus + ":" + hourBucket;
        String zoneName = resolveZoneName(zoneId);
        PushPayload payload = new PushPayload(
                "Zona " + zoneName + " em " + statusLabel(toStatus),
                "A condição da zona " + zoneName + " piorou para " + statusLabel(toStatus) + ".",
                "/",
                dedupKey,
                PushCategory.CLIMATIC
        );
        publish(PushEventType.CLIMATIC, PushCategory.CLIMATIC, dedupKey, payload);
    }

    public void publishCivilDefenseEmergency(CivilDefenseNotice notice) {
        if (!enabled()) {
            return;
        }

        String dedupKey = "civil-defense:" + notice.getExternalId();
        PushPayload payload = new PushPayload(
                "Defesa Civil: emergência",
                notice.getTitle(),
                notice.getLink(),
                dedupKey,
                PushCategory.CIVIL_DEFENSE
        );
        publish(PushEventType.CIVIL_DEFENSE, PushCategory.CIVIL_DEFENSE, dedupKey, payload);
    }

    private void publish(PushEventType eventType, PushCategory category, String dedupKey, PushPayload payload) {
        if (outboxRepository.existsByDedupKey(dedupKey)) {
            log.debug("Push event {} already dispatched, skipping", dedupKey);
            return;
        }

        try {
            String json = objectMapper.writeValueAsString(payload);
            outboxRepository.save(new PushOutbox(eventType, category.routingKey(), dedupKey, json, Instant.now()));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize push payload for {}", dedupKey, e);
        }
    }

    private boolean enabled() {
        boolean enabled = properties.isEnabled();
        if (!enabled) {
            log.debug("Push dispatch disabled, ignoring event");
        }
        return enabled;
    }

    private String resolveZoneName(String zoneId) {
        return zoneService.getZones().stream()
                .filter(zone -> zone.id().equals(zoneId))
                .findFirst()
                .map(Zone::name)
                .orElse(zoneId);
    }

    private static String severityLabel(Severity severity) {
        return switch (severity) {
            case MODERATE -> "moderado";
            case SEVERE -> "grave";
            case CRITICAL -> "crítico";
        };
    }

    private static String statusLabel(OverallStatus status) {
        return switch (status) {
            case NORMAL -> "normal";
            case ATTENTION -> "atenção";
            case ALERT -> "alerta";
            case CRITICAL -> "crítico";
            case UNKNOWN -> "desconhecido";
        };
    }
}
