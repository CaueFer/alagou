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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AlertService {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);
    private static final double DUPLICATE_RADIUS_METERS = 100;

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

        List<Alert> results;
        if (expired == null) {
            results = repository.findAll(sort);
        } else if (expired) {
            results = repository.findByExpirationDateBefore(Instant.now(), sort);
        } else {
            results = repository.findByActiveTrueAndExpirationDateGreaterThanEqual(Instant.now(), sort);
        }
        return results.stream().map(this::toResponse).toList();
    }

    public AlertResponse findById(Long id) {
        Alert alert = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        return toResponse(alert);
    }

    private AlertResponse toResponse(Alert alert) {
        List<String> urls = alert.getPhotos().stream()
                .map(p -> "/uploads/photos/" + p)
                .toList();
        double lat = alert.getLocation().getY();
        double lng = alert.getLocation().getX();
        long confirmationCount = confirmationRepository.countByAlertId(alert.getId());
        long clearReportCount = clearReportRepository.countByAlertId(alert.getId());
        return new AlertResponse(alert.getId(), alert.getType(), alert.getUsername(), alert.getSeverity(), lat, lng, urls,
                confirmationCount, clearReportCount, alert.getExpirationDate(), alert.getCreationDate());
    }
}
