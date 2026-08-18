package com.alagou.alert.service;

import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private AlertRepository repository;

    @Mock
    private PhotoStorageService photoStorage;

    @Mock
    private ConfirmationRepository confirmationRepository;

    @Mock
    private ClearReportRepository clearReportRepository;

    private AlertService service;

    @BeforeEach
    void setUp() {
        service = new AlertService(repository, photoStorage, confirmationRepository, clearReportRepository);
    }

    @Test
    void rejectsCreationWhenUserHasActiveAlertWithinRadius() {
        when(repository.existsActiveByUsernameWithinRadius(anyString(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.create(AlertType.USER, "citizen1", Severity.MODERATE, -26.3, -48.8, List.of()))
                .isInstanceOf(BusinessRuleException.class);

        verifyNoInteractions(photoStorage);
    }
}
