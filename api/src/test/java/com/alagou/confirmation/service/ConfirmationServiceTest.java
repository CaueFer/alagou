package com.alagou.confirmation.service;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.confirmation.Confirmation;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfirmationServiceTest {

    @Mock
    private ConfirmationRepository repository;

    @Mock
    private AlertRepository alertRepository;

    private ConfirmationService service;

    @BeforeEach
    void setUp() {
        service = new ConfirmationService(repository, alertRepository);
    }

    private Alert foreignAlert() {
        Alert alert = mock(Alert.class);
        lenient().when(alert.getUsername()).thenReturn("someone-else");
        return alert;
    }

    @Test
    void rejectsSecondConfirmationFromSameUser() {
        Alert alert = foreignAlert();
        when(alertRepository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.existsByAlertIdAndUsername(1L, "citizen1")).thenReturn(true);

        assertThatThrownBy(() -> service.create(1L, "citizen1", "203.0.113.1"))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void translatesUniqueConstraintRaceIntoBusinessRule() {
        Alert alert = foreignAlert();
        when(alertRepository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.existsByAlertIdAndUsername(1L, "citizen1")).thenReturn(false);
        when(repository.saveAndFlush(any(Confirmation.class)))
                .thenThrow(new DataIntegrityViolationException("uq_confirmation_alert_username"));

        assertThatThrownBy(() -> service.create(1L, "citizen1", "203.0.113.1"))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void persistsSourceIpAndRenewsExpirationOnSuccess() {
        Alert alert = foreignAlert();
        when(alertRepository.findById(1L)).thenReturn(Optional.of(alert));
        when(repository.existsByAlertIdAndUsername(1L, "citizen1")).thenReturn(false);
        when(repository.saveAndFlush(any(Confirmation.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(alert.getExpirationDate()).thenReturn(Instant.now());

        service.create(1L, "citizen1", "203.0.113.9");

        verify(alert).renewExpiration(any(Instant.class));
        verify(alertRepository).save(alert);
    }
}
