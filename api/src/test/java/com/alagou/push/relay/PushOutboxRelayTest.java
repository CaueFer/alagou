package com.alagou.push.relay;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Pageable;

import com.alagou.push.PushEventType;
import com.alagou.push.PushOutbox;
import com.alagou.push.PushOutboxStatus;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dao.PushOutboxRepository;
import com.alagou.push.dto.PushEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PushOutboxRelayTest {

    private static final String PAYLOAD_JSON =
            "{\"title\":\"t\",\"body\":\"b\",\"url\":\"/\",\"tag\":\"user-alert:1\",\"category\":\"NEARBY\"}";

    @Mock
    private PushOutboxRepository outboxRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    private PushProperties properties;
    private PushOutboxRelay relay;

    @BeforeEach
    void setUp() {
        properties = new PushProperties();
        properties.setOutboxClaimSize(50);
        properties.setMaxAttempts(5);
        relay = new PushOutboxRelay(outboxRepository, rabbitTemplate, properties, new ObjectMapper());
    }

    private PushOutbox pendingRow() {
        return new PushOutbox(PushEventType.USER_ALERT, "push.nearby", "user-alert:1", PAYLOAD_JSON, Instant.now());
    }

    @Test
    void claimsPendingRowsPublishesThemAndMarksSent() {
        PushOutbox row = pendingRow();
        when(outboxRepository.claimPending(any(Pageable.class))).thenReturn(List.of(row));

        relay.relayPending();

        verify(rabbitTemplate).convertAndSend(eq("push.events"), eq("push.nearby"), any(PushEvent.class));
        assertThat(row.getStatus()).isEqualTo(PushOutboxStatus.SENT);
        assertThat(row.getSentAt()).isNotNull();
        assertThat(row.getAttempts()).isEqualTo(1);
    }

    @Test
    void keepsRowPendingWhenPublishFailsBelowMaxAttempts() {
        PushOutbox row = pendingRow();
        when(outboxRepository.claimPending(any(Pageable.class))).thenReturn(List.of(row));
        doThrow(new RuntimeException("broker down"))
                .when(rabbitTemplate).convertAndSend(anyString(), anyString(), any(Object.class));

        relay.relayPending();

        assertThat(row.getStatus()).isEqualTo(PushOutboxStatus.PENDING);
        assertThat(row.getAttempts()).isEqualTo(1);
    }

    @Test
    void marksRowFailedOnceMaxAttemptsIsReached() {
        properties.setMaxAttempts(1);
        PushOutbox row = pendingRow();
        when(outboxRepository.claimPending(any(Pageable.class))).thenReturn(List.of(row));
        doThrow(new RuntimeException("broker down"))
                .when(rabbitTemplate).convertAndSend(anyString(), anyString(), any(Object.class));

        relay.relayPending();

        assertThat(row.getStatus()).isEqualTo(PushOutboxStatus.FAILED);
    }
}
