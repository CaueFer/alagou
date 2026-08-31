package com.alagou.admin;

import com.alagou.admin.dto.AdminAlertResponse;
import com.alagou.admin.dto.AdminOverviewResponse;
import com.alagou.admin.dto.ApiStatusResponse;
import com.alagou.admin.dto.SchedulerStatusResponse;
import com.alagou.admin.scheduler.ScheduledJobCatalog;
import com.alagou.admin.scheduler.SchedulerExecutionInfo;
import com.alagou.admin.scheduler.SchedulerExecutionTracker;
import com.alagou.alert.Alert;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.presence.PresenceService;
import com.alagou.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private static final int DEFAULT_LIMIT = 50;
    private static final int MAX_LIMIT = 200;

    private final UsuarioRepository usuarioRepository;
    private final AlertRepository alertRepository;
    private final ConfirmationRepository confirmationRepository;
    private final ClearReportRepository clearReportRepository;
    private final CivilDefenseNoticeRepository civilDefenseNoticeRepository;
    private final PresenceService presenceService;
    private final SchedulerExecutionTracker schedulerExecutionTracker;
    private final DataSource dataSource;
    private final String version;

    public AdminService(
            UsuarioRepository usuarioRepository,
            AlertRepository alertRepository,
            ConfirmationRepository confirmationRepository,
            ClearReportRepository clearReportRepository,
            CivilDefenseNoticeRepository civilDefenseNoticeRepository,
            PresenceService presenceService,
            SchedulerExecutionTracker schedulerExecutionTracker,
            DataSource dataSource,
            @Value("${app.version:0.0.1-SNAPSHOT}") String version
    ) {
        this.usuarioRepository = usuarioRepository;
        this.alertRepository = alertRepository;
        this.confirmationRepository = confirmationRepository;
        this.clearReportRepository = clearReportRepository;
        this.civilDefenseNoticeRepository = civilDefenseNoticeRepository;
        this.presenceService = presenceService;
        this.schedulerExecutionTracker = schedulerExecutionTracker;
        this.dataSource = dataSource;
        this.version = version;
    }

    public AdminOverviewResponse overview() {
        long totalUsers = usuarioRepository.count();
        long googleAccounts = usuarioRepository.countByGoogleIdIsNotNull();
        long passwordAccounts = usuarioRepository.countByPasswordHashIsNotNull();
        long activeUsers = presenceService.countActiveUsers();
        long totalAlerts = alertRepository.count();
        long activeAlerts = alertRepository.countByActiveTrue();
        long expiredAlerts = alertRepository.countByExpirationDateBefore(Instant.now());
        long totalConfirmations = confirmationRepository.count();
        long totalClearReports = clearReportRepository.count();
        long totalCivilDefenseNotices = civilDefenseNoticeRepository.count();

        return new AdminOverviewResponse(
                totalUsers,
                googleAccounts,
                passwordAccounts,
                activeUsers,
                totalAlerts,
                activeAlerts,
                expiredAlerts,
                countByType(),
                countBySeverity(),
                totalConfirmations,
                totalClearReports,
                totalCivilDefenseNotices
        );
    }

    public List<AdminAlertResponse> listAlerts(Boolean active, AlertType type, Severity severity, String order, Integer limit) {
        int safeLimit = limit == null ? DEFAULT_LIMIT : Math.min(Math.max(limit, 1), MAX_LIMIT);
        Sort sort = "old".equalsIgnoreCase(order)
                ? Sort.by(Sort.Direction.ASC, "creationDate")
                : Sort.by(Sort.Direction.DESC, "creationDate");

        Specification<Alert> specification = Specification.where(null);
        if (active != null) {
            specification = specification.and((root, query, builder) -> builder.equal(root.get("active"), active));
        }
        if (type != null) {
            specification = specification.and((root, query, builder) -> builder.equal(root.get("type"), type));
        }
        if (severity != null) {
            specification = specification.and((root, query, builder) -> builder.equal(root.get("severity"), severity));
        }

        return alertRepository.findAll(specification, PageRequest.of(0, safeLimit, sort))
                .stream()
                .map(this::toAdminAlertResponse)
                .toList();
    }

    public List<SchedulerStatusResponse> listSchedulers() {
        Instant now = Instant.now();
        return ScheduledJobCatalog.jobs().stream()
                .map(job -> {
                    SchedulerExecutionInfo info = schedulerExecutionTracker.getInfo(job.id());
                    String status = statusFor(job, info, now);
                    Instant nextExpectedRunAt = info == null || info.lastRunAt() == null
                            ? null
                            : info.lastRunAt().plus(job.cadence());
                    if (nextExpectedRunAt == null && info != null && info.lastSuccessAt() != null) {
                        nextExpectedRunAt = info.lastSuccessAt().plus(job.cadence());
                    }
                    return new SchedulerStatusResponse(
                            job.id(),
                            job.name(),
                            job.description(),
                            job.interval(),
                            info == null ? null : info.lastRunAt(),
                            info == null ? null : info.lastSuccessAt(),
                            info == null ? null : info.lastErrorAt(),
                            info == null ? null : info.lastErrorMessage(),
                            info == null ? 0 : info.lastDurationMs(),
                            info == null ? 0 : info.runCount(),
                            info == null ? 0 : info.failureCount(),
                            nextExpectedRunAt,
                            status
                    );
                })
                .toList();
    }

    public ApiStatusResponse status() {
        Instant startedAt = Instant.ofEpochMilli(ManagementFactory.getRuntimeMXBean().getStartTime());
        Instant now = Instant.now();
        String database = databaseStatus();
        return new ApiStatusResponse(
                "UP".equals(database) ? "UP" : "DOWN",
                database,
                startedAt,
                Duration.between(startedAt, now).getSeconds(),
                now,
                version
        );
    }

    private Map<String, Long> countByType() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : alertRepository.countAlertsByType()) {
            counts.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }
        return counts;
    }

    private Map<String, Long> countBySeverity() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : alertRepository.countAlertsBySeverity()) {
            counts.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }
        return counts;
    }

    private AdminAlertResponse toAdminAlertResponse(Alert alert) {
        List<String> photoUrls = alert.getPhotos().stream()
                .map(photo -> "/uploads/photos/" + photo)
                .toList();
        return new AdminAlertResponse(
                alert.getId(),
                alert.getType(),
                alert.getUsername(),
                alert.getSeverity(),
                alert.isActive(),
                alert.getLocation().getY(),
                alert.getLocation().getX(),
                photoUrls,
                confirmationRepository.countByAlertId(alert.getId()),
                clearReportRepository.countByAlertId(alert.getId()),
                alert.getExpirationDate(),
                alert.getCreationDate()
        );
    }

    private String databaseStatus() {
        try (Connection ignored = dataSource.getConnection()) {
            return "UP";
        } catch (Exception ex) {
            return "DOWN";
        }
    }

    private String statusFor(ScheduledJobCatalog.ScheduledJobDescriptor job, SchedulerExecutionInfo info, Instant now) {
        if (info == null || info.lastRunAt() == null) {
            return "NEVER_RAN";
        }

        if (info.lastErrorAt() != null
                && (info.lastSuccessAt() == null || info.lastErrorAt().isAfter(info.lastSuccessAt()))) {
            return "FAILING";
        }

        Instant expectedNextRunAt = info.lastRunAt().plus(job.cadence().multipliedBy(2));
        if (now.isAfter(expectedNextRunAt)) {
            return "LATE";
        }

        return "OK";
    }
}
