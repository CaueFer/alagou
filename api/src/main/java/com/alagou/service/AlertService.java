package com.alagou.service;

import com.alagou.domain.Alert;
import com.alagou.domain.AlertType;
import com.alagou.dto.AlertResponse;
import com.alagou.repository.AlertRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository repository;
    private final PhotoStorageService photoStorage;

    public AlertService(AlertRepository repository, PhotoStorageService photoStorage) {
        this.repository = repository;
        this.photoStorage = photoStorage;
    }

    public AlertResponse create(AlertType type, String username, List<MultipartFile> photos) {
        Instant now = Instant.now();
        List<String> stored = photoStorage.store(photos);
        Alert alert = new Alert(type, username, stored, now.plus(3, ChronoUnit.HOURS), now);
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

    private AlertResponse toResponse(Alert alert) {
        List<String> urls = alert.getPhotos().stream()
                .map(p -> "/uploads/photos/" + p)
                .toList();
        return new AlertResponse(alert.getId(), alert.getType(), alert.getUsername(), urls, alert.getExpirationDate(), alert.getCreationDate());
    }
}
