package com.alagou.push.relay;

import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.alagou.push.PushCategory;
import com.alagou.push.PushOutbox;
import com.alagou.push.config.PushProperties;
import com.alagou.push.config.PushRabbitConfig;
import com.alagou.push.dao.PushOutboxRepository;
import com.alagou.push.dto.PushEvent;
import com.alagou.push.dto.PushPayload;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@ConditionalOnProperty(name = "app.push.enabled", havingValue = "true")
public class PushOutboxRelay {

    private static final Logger log = LoggerFactory.getLogger(PushOutboxRelay.class);

    private final PushOutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    private final PushProperties properties;
    private final ObjectMapper objectMapper;

    public PushOutboxRelay(PushOutboxRepository outboxRepository,
                           RabbitTemplate rabbitTemplate,
                           PushProperties properties,
                           ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Scheduled(fixedDelayString = "${app.push.outbox-relay-ms}")
    @Transactional
    public void relayPending() {
        List<PushOutbox> claimed = outboxRepository.claimPending(PageRequest.of(0, properties.getOutboxClaimSize()));
        for (PushOutbox row : claimed) {
            row.registerAttempt();
            try {
                rabbitTemplate.convertAndSend(PushRabbitConfig.EVENTS_EXCHANGE, row.getRoutingKey(), toEvent(row));
                row.markSent(Instant.now());
            } catch (Exception e) {
                if (row.getAttempts() >= properties.getMaxAttempts()) {
                    row.markFailed();
                    log.error("Push outbox row {} failed after {} attempts, marking FAILED", row.getId(), row.getAttempts(), e);
                } else {
                    log.warn("Push outbox row {} publish failed on attempt {}, will retry", row.getId(), row.getAttempts(), e);
                }
            }
        }
    }

    private PushEvent toEvent(PushOutbox row) {
        try {
            PushPayload payload = objectMapper.readValue(row.getPayload(), PushPayload.class);
            return new PushEvent(row.getDedupKey(), PushCategory.fromRoutingKey(row.getRoutingKey()), payload);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize push outbox payload for row " + row.getId(), e);
        }
    }
}
