package com.alagou.admin;

import com.alagou.admin.dto.AlertTimelinePointResponse;
import com.alagou.admin.scheduler.SchedulerExecutionTracker;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.presence.PresenceService;
import com.alagou.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.sql.DataSource;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    private static final Instant NOW = Instant.parse("2026-09-20T15:00:00Z");

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private AlertRepository alertRepository;

    @Mock
    private ConfirmationRepository confirmationRepository;

    @Mock
    private ClearReportRepository clearReportRepository;

    @Mock
    private CivilDefenseNoticeRepository civilDefenseNoticeRepository;

    @Mock
    private PresenceService presenceService;

    @Mock
    private SchedulerExecutionTracker schedulerExecutionTracker;

    @Mock
    private DataSource dataSource;

    private AdminService service;

    @BeforeEach
    void setUp() {
        service = new AdminService(usuarioRepository, alertRepository, confirmationRepository,
                clearReportRepository, civilDefenseNoticeRepository, presenceService,
                schedulerExecutionTracker, dataSource, "test", false);
    }

    private Object[] row(String createdAt, Severity severity, AlertType type) {
        return new Object[]{Instant.parse(createdAt), severity, type};
    }

    @Test
    void timelineReturnsOneZeroFilledPointPerDayInChronologicalOrder() {
        when(alertRepository.findTimelineRowsSince(any())).thenReturn(List.of());

        List<AlertTimelinePointResponse> timeline = service.alertTimeline(7, NOW);

        assertThat(timeline).hasSize(7);
        assertThat(timeline.getFirst().date()).isEqualTo(LocalDate.of(2026, 9, 14));
        assertThat(timeline.getLast().date()).isEqualTo(LocalDate.of(2026, 9, 20));
        assertThat(timeline).allSatisfy(point -> {
            assertThat(point.total()).isZero();
            assertThat(point.bySeverity()).containsOnlyKeys("MODERATE", "SEVERE", "CRITICAL");
            assertThat(point.byType()).containsOnlyKeys("USER", "CLIMATIC", "CIVIL_DEFENSE");
        });
    }

    @Test
    void timelineCountsAlertsBySeverityAndTypeOnTheirLocalDay() {
        when(alertRepository.findTimelineRowsSince(any())).thenReturn(List.of(
                row("2026-09-20T13:00:00Z", Severity.CRITICAL, AlertType.USER),
                row("2026-09-20T14:00:00Z", Severity.CRITICAL, AlertType.CLIMATIC),
                row("2026-09-20T12:00:00Z", Severity.MODERATE, AlertType.USER),
                row("2026-09-18T18:00:00Z", Severity.SEVERE, AlertType.CIVIL_DEFENSE)
        ));

        List<AlertTimelinePointResponse> timeline = service.alertTimeline(7, NOW);

        AlertTimelinePointResponse today = timeline.getLast();
        assertThat(today.total()).isEqualTo(3);
        assertThat(today.bySeverity()).containsEntry("CRITICAL", 2L).containsEntry("MODERATE", 1L)
                .containsEntry("SEVERE", 0L);
        assertThat(today.byType()).containsEntry("USER", 2L).containsEntry("CLIMATIC", 1L);

        AlertTimelinePointResponse september18 = timeline.get(4);
        assertThat(september18.date()).isEqualTo(LocalDate.of(2026, 9, 18));
        assertThat(september18.total()).isEqualTo(1);
        assertThat(september18.bySeverity()).containsEntry("SEVERE", 1L);
    }

    @Test
    void timelineBucketsByTheSaoPauloDayNotTheUtcDay() {
        when(alertRepository.findTimelineRowsSince(any())).thenReturn(List.<Object[]>of(
                row("2026-09-20T02:30:00Z", Severity.SEVERE, AlertType.USER)
        ));

        List<AlertTimelinePointResponse> timeline = service.alertTimeline(3, NOW);

        assertThat(timeline.get(1).date()).isEqualTo(LocalDate.of(2026, 9, 19));
        assertThat(timeline.get(1).total()).isEqualTo(1);
        assertThat(timeline.getLast().total()).isZero();
    }

    @Test
    void timelineQueriesFromTheStartOfTheFirstLocalDay() {
        when(alertRepository.findTimelineRowsSince(any())).thenReturn(List.of());

        service.alertTimeline(7, NOW);

        ArgumentCaptor<Instant> from = ArgumentCaptor.forClass(Instant.class);
        verify(alertRepository).findTimelineRowsSince(from.capture());
        assertThat(from.getValue()).isEqualTo(Instant.parse("2026-09-14T03:00:00Z"));
    }

    @Test
    void timelineClampsTheRequestedNumberOfDays() {
        when(alertRepository.findTimelineRowsSince(any())).thenReturn(List.of());

        assertThat(service.alertTimeline(0, NOW)).hasSize(1);
        assertThat(service.alertTimeline(-5, NOW)).hasSize(1);
        assertThat(service.alertTimeline(500, NOW)).hasSize(90);
        assertThat(service.alertTimeline(null, NOW)).hasSize(7);
    }
}
