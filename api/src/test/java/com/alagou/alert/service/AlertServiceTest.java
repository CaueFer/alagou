package com.alagou.alert.service;

import com.alagou.alert.Alert;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.exception.BusinessRuleException;
import com.alagou.push.service.PushDispatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
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

    @Mock
    private PushDispatchService pushDispatchService;

    private AlertService service;

    @BeforeEach
    void setUp() {
        service = new AlertService(repository, photoStorage, confirmationRepository, clearReportRepository, pushDispatchService);
    }

    @Test
    void rejectsCreationWhenUserHasActiveAlertWithinRadius() {
        when(repository.existsActiveByUsernameWithinRadius(anyString(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.create(AlertType.USER, "citizen1", Severity.MODERATE, -26.3, -48.8, List.of()))
                .isInstanceOf(BusinessRuleException.class);

        verifyNoInteractions(photoStorage);
        verifyNoInteractions(pushDispatchService);
    }

    @Test
    void dispatchesPushForSevereUserAlert() {
        when(photoStorage.store(anyList())).thenReturn(List.of());
        when(repository.save(any(Alert.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.create(AlertType.USER, "citizen1", Severity.SEVERE, -26.3, -48.8, List.of());

        verify(pushDispatchService).publishUserAlert(any(Alert.class));
    }

    @Test
    void doesNotDispatchPushForModerateUserAlert() {
        when(photoStorage.store(anyList())).thenReturn(List.of());
        when(repository.save(any(Alert.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.create(AlertType.USER, "citizen1", Severity.MODERATE, -26.3, -48.8, List.of());

        verifyNoInteractions(pushDispatchService);
    }
}
