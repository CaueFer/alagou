package com.alagou.alert.service;

import com.alagou.alert.Alert;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.exception.BusinessRuleException;
import com.alagou.push.service.PushDispatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
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

    @Test
    void rejectsCreationOutsideJoinvilleBoundingBox() {
        assertThatThrownBy(() -> service.create(AlertType.USER, "citizen1", Severity.MODERATE, 0.0, 0.0, List.of()))
                .isInstanceOf(BusinessRuleException.class);

        verifyNoInteractions(photoStorage);
        verifyNoInteractions(repository);
    }

    @Test
    void rejectsCreationWithMoreThanThreePhotos() {
        List<MockMultipartFile> photos = List.of(
                photo("a"), photo("b"), photo("c"), photo("d"));

        assertThatThrownBy(() -> service.create(AlertType.USER, "citizen1", Severity.MODERATE, -26.3, -48.8, List.copyOf(photos)))
                .isInstanceOf(BusinessRuleException.class);

        verifyNoInteractions(photoStorage);
    }

    @Test
    void findAllUsesSingleAggregatedCountQueryPerRelation() {
        Alert alert = new Alert(AlertType.USER, "citizen1", Severity.MODERATE,
                new GeometryFactory(new PrecisionModel(), 4326).createPoint(new Coordinate(-48.8, -26.3)),
                List.of(), Instant.now(), Instant.now());
        setId(alert, 1L);

        when(repository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(alert)));
        when(confirmationRepository.countByAlertIdIn(List.of(1L)))
                .thenReturn(List.<Object[]>of(new Object[]{1L, 4L}));
        when(clearReportRepository.countByAlertIdIn(List.of(1L)))
                .thenReturn(List.<Object[]>of(new Object[]{1L, 2L}));

        List<AlertResponse> responses = service.findAll(null, "recent");

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).confirmationCount()).isEqualTo(4L);
        assertThat(responses.get(0).clearReportCount()).isEqualTo(2L);
        verify(confirmationRepository, never()).countByAlertId(any());
        verify(clearReportRepository, never()).countByAlertId(any());
    }

    private static MockMultipartFile photo(String name) {
        return new MockMultipartFile("photos", name + ".jpg", "image/jpeg", new byte[]{1, 2, 3});
    }

    private static void setId(Alert alert, long id) {
        try {
            var field = Alert.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(alert, id);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }
}
