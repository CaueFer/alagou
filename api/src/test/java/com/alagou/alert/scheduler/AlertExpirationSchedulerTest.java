package com.alagou.alert.scheduler;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertExpirationSchedulerTest {

    @Mock
    private AlertRepository repository;

    private AlertExpirationScheduler scheduler;

    @BeforeEach
    void setUp() {
        scheduler = new AlertExpirationScheduler(repository);
    }

    @Test
    void deactivatesAlertsPastExpiration() {
        Alert overdueAlert = new Alert(null, "citizen1", null, null, Instant.now().minusSeconds(60), Instant.now().minusSeconds(3600));
        when(repository.findByActiveTrueAndExpirationDateBefore(any(Instant.class)))
                .thenReturn(List.of(overdueAlert));

        scheduler.expireOverdueAlerts();

        assertThat(overdueAlert.isActive()).isFalse();

        ArgumentCaptor<List<Alert>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());
        assertThat(captor.getValue()).containsExactly(overdueAlert);
    }

    @Test
    void doesNothingWhenNoAlertsAreOverdue() {
        when(repository.findByActiveTrueAndExpirationDateBefore(any(Instant.class)))
                .thenReturn(List.of());

        scheduler.expireOverdueAlerts();

        verify(repository).findByActiveTrueAndExpirationDateBefore(any(Instant.class));
        verify(repository).saveAll(List.of());
        verifyNoMoreInteractions(repository);
    }
}
