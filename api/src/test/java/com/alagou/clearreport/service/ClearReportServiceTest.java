package com.alagou.clearreport.service;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.clearreport.ClearReport;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.clearreport.dto.ClearReportResponse;
import com.alagou.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClearReportServiceTest {

    @Mock
    private ClearReportRepository repository;

    @Mock
    private AlertRepository alertRepository;

    private ClearReportService service;

    @BeforeEach
    void setUp() {
        service = new ClearReportService(repository, alertRepository);
    }

    @Test
    void rejectsSecondReportFromSameUser() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(mock(Alert.class)));
        when(repository.existsByAlertIdAndUsername(1L, "citizen1")).thenReturn(true);

        assertThatThrownBy(() -> service.create(1L, "citizen1", "203.0.113.1"))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void translatesUniqueConstraintRaceIntoBusinessRule() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(mock(Alert.class)));
        when(repository.existsByAlertIdAndUsername(1L, "citizen1")).thenReturn(false);
        when(repository.saveAndFlush(any(ClearReport.class)))
                .thenThrow(new DataIntegrityViolationException("uq_clear_report_alert_username"));

        assertThatThrownBy(() -> service.create(1L, "citizen1", "203.0.113.1"))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void deactivatesOnlyWithThreeDistinctUsernamesAndThreeDistinctIps() {
        Alert alert = mock(Alert.class);
        when(alert.isActive()).thenReturn(true);
        when(alertRepository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.existsByAlertIdAndUsername(1L, "citizen3")).thenReturn(false);
        when(repository.saveAndFlush(any(ClearReport.class))).thenAnswer(inv -> inv.getArgument(0));
        when(repository.countDistinctUsernameByAlertId(1L)).thenReturn(3L);
        when(repository.countDistinctSourceIpByAlertId(1L)).thenReturn(3L);

        ClearReportResponse response = service.create(1L, "citizen3", "203.0.113.3");

        assertThat(response.alertDeactivated()).isTrue();
        verify(alert).deactivate();
        verify(alertRepository).save(alert);
    }

    @Test
    void doesNotDeactivateWhenIpsAreNotDistinctEnough() {
        Alert alert = mock(Alert.class);
        lenient().when(alert.isActive()).thenReturn(true);
        when(alertRepository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.existsByAlertIdAndUsername(1L, "citizen3")).thenReturn(false);
        when(repository.saveAndFlush(any(ClearReport.class))).thenAnswer(inv -> inv.getArgument(0));
        when(repository.countDistinctUsernameByAlertId(1L)).thenReturn(3L);
        when(repository.countDistinctSourceIpByAlertId(1L)).thenReturn(2L);

        ClearReportResponse response = service.create(1L, "citizen3", "203.0.113.3");

        assertThat(response.alertDeactivated()).isFalse();
        verify(alert, never()).deactivate();
    }
}
