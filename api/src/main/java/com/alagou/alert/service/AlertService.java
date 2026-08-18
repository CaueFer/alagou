package com.alagou.alert.service;

import com.alagou.alert.Alert;
import com.alagou.alert.AlertType;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.exception.ResourceNotFoundException;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AlertService {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory(new PrecisionModel(), 4326);

    private final AlertRepository repository;
    private final PhotoStorageService photoStorage;

    public AlertService(AlertRepository repository, PhotoStorageService photoStorage) {
        this.repository = repository;
        this.photoStorage = photoStorage;
    }

    public AlertResponse create(AlertType type, String username, double lat, double lng, List<MultipartFile> photos) {
        Instant now = Instant.now();
        List<String> stored = photoStorage.store(photos);
        Point location = GEOMETRY_FACTORY.createPoint(new Coordinate(lng, lat));
        Alert alert = new Alert(type, username, location, stored, now.plus(3, ChronoUnit.HOURS), now);
        return toResponse(repository.save(alert));
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
            results = repository.findByExpirationDateGreaterThanEqual(Instant.now(), sort);
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
        return new AlertResponse(alert.getId(), alert.getType(), alert.getUsername(), lat, lng, urls, alert.getExpirationDate(), alert.getCreationDate());
    }
}
