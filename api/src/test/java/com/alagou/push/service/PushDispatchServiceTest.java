package com.alagou.push.service;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alagou.alert.Alert;
import com.alagou.alert.Severity;
import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.push.PushEventType;
import com.alagou.push.PushOutbox;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dao.PushOutboxRepository;
import com.alagou.zone.OverallStatus;
import com.alagou.zone.ZoneService;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PushDispatchServiceTest {

    @Mock
    private PushOutboxRepository outboxRepository;

    @Mock
    private ZoneService zoneService;

    private PushProperties properties;
    private PushDispatchService service;

    @BeforeEach
    void setUp() {
        properties = new PushProperties();
        properties.setEnabled(true);
        properties.setClimaticCooldownMinutes(60);
        service = new PushDispatchService(outboxRepository, zoneService, properties, new ObjectMapper());
    }

    private Alert alert(long id, Severity severity) {
        Alert alert = org.mockito.Mockito.mock(Alert.class);
        when(alert.getId()).thenReturn(id);
        when(alert.getSeverity()).thenReturn(severity);
        return alert;
    }

    @Test
    void isNoOpWhenPushDisabled() {
        properties.setEnabled(false);

        service.publishUserAlert(org.mockito.Mockito.mock(Alert.class));

        verifyNoInteractions(outboxRepository);
    }

    @Test
    void writesOutboxRowForUserAlertWithNearbyRoutingKey() {
        service.publishUserAlert(alert(42L, Severity.CRITICAL));

        ArgumentCaptor<PushOutbox> captor = ArgumentCaptor.forClass(PushOutbox.class);
        verify(outboxRepository).save(captor.capture());
        PushOutbox row = captor.getValue();
        assertThat(row.getEventType()).isEqualTo(PushEventType.USER_ALERT);
        assertThat(row.getRoutingKey()).isEqualTo("push.nearby");
        assertThat(row.getDedupKey()).isEqualTo("user-alert:42");
        assertThat(row.getPayload()).contains("\"category\":\"NEARBY\"");
    }

    @Test
    void climaticDedupKeyIsScopedToZoneAndTargetStatus() {
        when(zoneService.getZones()).thenReturn(List.of());

        service.publishClimatic("centro", OverallStatus.ATTENTION, OverallStatus.ALERT);

        ArgumentCaptor<PushOutbox> captor = ArgumentCaptor.forClass(PushOutbox.class);
        verify(outboxRepository).save(captor.capture());
        assertThat(captor.getValue().getEventType()).isEqualTo(PushEventType.CLIMATIC);
        assertThat(captor.getValue().getRoutingKey()).isEqualTo("push.climatic");
        assertThat(captor.getValue().getDedupKey()).startsWith("climatic:centro:ALERT:");
    }

    @Test
    void climaticCooldownSuppressesTheSecondEvent() {
        when(outboxRepository.existsRecentWithDedupPrefix(eq(PushEventType.CLIMATIC), anyString(), any()))
                .thenReturn(true);

        service.publishClimatic("centro", OverallStatus.ATTENTION, OverallStatus.ALERT);

        verify(outboxRepository, never()).save(any());
    }

    @Test
    void civilDefenseDedupKeyUsesTheExternalId() {
        CivilDefenseNotice notice = org.mockito.Mockito.mock(CivilDefenseNotice.class);
        when(notice.getExternalId()).thenReturn(777L);
        when(notice.getTitle()).thenReturn("Emergencia");
        when(notice.getLink()).thenReturn("https://dc/notice/777");

        service.publishCivilDefenseEmergency(notice);

        ArgumentCaptor<PushOutbox> captor = ArgumentCaptor.forClass(PushOutbox.class);
        verify(outboxRepository).save(captor.capture());
        assertThat(captor.getValue().getEventType()).isEqualTo(PushEventType.CIVIL_DEFENSE);
        assertThat(captor.getValue().getRoutingKey()).isEqualTo("push.civil-defense");
        assertThat(captor.getValue().getDedupKey()).isEqualTo("civil-defense:777");
    }

    @Test
    void skipsWhenDedupKeyAlreadyDispatched() {
        when(outboxRepository.existsByDedupKey("user-alert:42")).thenReturn(true);

        service.publishUserAlert(alert(42L, Severity.SEVERE));

        verify(outboxRepository, never()).save(any());
    }
}
