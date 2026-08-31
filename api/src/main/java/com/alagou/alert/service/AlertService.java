package com.alagou.alert.service;

import com.alagou.alert.Alert;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.clearreport.dao.ClearReportRepository;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.exception.BusinessRuleException;
import com.alagou.exception.ResourceNotFoundException;
import com.alagou.push.service.PushDispatchService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);
    private static final double DUPLICATE_RADIUS_METERS = 100;
    private static final int MAX_RESULTS = 200;
    private static final int MAX_PHOTOS = 3;

    // Padded bounding box around Joinville/SC; a report outside this is a client bug or abuse, not a real location.
    private static final double LAT_MIN = -26.55;
    private static final double LAT_MAX = -26.05;
    private static final double LNG_MIN = -49.05;
    private static final double LNG_MAX = -48.70;

    private final AlertRepository repository;
    private final PhotoStorageService photoStorage;
    private final ConfirmationRepository confirmationRepository;
    private final ClearReportRepository clearReportRepository;
    private final PushDispatchService pushDispatchService;

    public AlertService(
            AlertRepository repository,
            PhotoStorageService photoStorage,
            ConfirmationRepository confirmationRepository,
            ClearReportRepository clearReportRepository,
            PushDispatchService pushDispatchService
    ) {
        this.repository = repository;
        this.photoStorage = photoStorage;
        this.confirmationRepository = confirmationRepository;
        this.clearReportRepository = clearReportRepository;
        this.pushDispatchService = pushDispatchService;
    }

    @Transactional
    public AlertResponse create(AlertType type, String username, Severity severity, double lat, double lng, List<MultipartFile> photos) {
        if (lat < LAT_MIN || lat > LAT_MAX || lng < LNG_MIN || lng > LNG_MAX) {
            throw new BusinessRuleException("Localização fora da área de cobertura");
        }
        if (photos != null && photos.stream().filter(p -> p != null && !p.isEmpty()).count() > MAX_PHOTOS) {
            throw new BusinessRuleException("Máximo de " + MAX_PHOTOS + " fotos por relato");
        }
        if (repository.existsActiveByUsernameWithinRadius(username, lat, lng, DUPLICATE_RADIUS_METERS)) {
            throw new BusinessRuleException("User already has an active alert within " + (int) DUPLICATE_RADIUS_METERS + " meters of this location");
        }

        Instant now = Instant.now();
        List<String> stored = photoStorage.store(photos);
        Point location = GEOMETRY_FACTORY.createPoint(new Coordinate(lng, lat));
        Alert alert = new Alert(type, username, severity, location, stored, now.plus(3, ChronoUnit.HOURS), now);
        Alert saved = repository.save(alert);

        if (type == AlertType.USER && (severity == Severity.SEVERE || severity == Severity.CRITICAL)) {
            pushDispatchService.publishUserAlert(saved);
        }

        return toResponse(saved);
    }

    public List<AlertResponse> findAll(Boolean expired, String order) {
        Sort sort = "old".equalsIgnoreCase(order)
                ? Sort.by("creationDate").ascending()
                : Sort.by("creationDate").descending();
        PageRequest page = PageRequest.of(0, MAX_RESULTS, sort);

        List<Alert> results;
        if (expired == null) {
            results = repository.findAll(page).getContent();
        } else if (expired) {
            results = repository.findByExpirationDateBefore(Instant.now(), page);
        } else {
            results = repository.findByActiveTrueAndExpirationDateGreaterThanEqual(Instant.now(), page);
        }

        List<Long> ids = results.stream().map(Alert::getId).toList();
        Map<Long, Long> confirmationCounts = countsByAlertId(confirmationRepository.countByAlertIdIn(ids));
        Map<Long, Long> clearReportCounts = countsByAlertId(clearReportRepository.countByAlertIdIn(ids));

        return results.stream()
                .map(alert -> toResponse(alert,
                        confirmationCounts.getOrDefault(alert.getId(), 0L),
                        clearReportCounts.getOrDefault(alert.getId(), 0L)))
                .toList();
    }

    public AlertResponse findById(Long id) {
        Alert alert = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        return toResponse(alert);
    }

    private AlertResponse toResponse(Alert alert) {
        return toResponse(alert,
                confirmationRepository.countByAlertId(alert.getId()),
                clearReportRepository.countByAlertId(alert.getId()));
    }

    private AlertResponse toResponse(Alert alert, long confirmationCount, long clearReportCount) {
        List<String> urls = alert.getPhotos().stream()
                .map(p -> "/uploads/photos/" + p)
                .toList();
        double lat = alert.getLocation().getY();
        double lng = alert.getLocation().getX();
        return new AlertResponse(alert.getId(), alert.getType(), alert.getUsername(), alert.getSeverity(), lat, lng, urls,
                confirmationCount, clearReportCount, alert.getExpirationDate(), alert.getCreationDate());
    }

    private static Map<Long, Long> countsByAlertId(List<Object[]> rows) {
        return rows.stream().collect(Collectors.toMap(
                row -> (Long) row[0],
                row -> (Long) row[1]));
    }
}
