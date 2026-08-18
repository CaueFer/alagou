package com.alagou.alert.scheduler;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class AlertExpirationScheduler {

    private final AlertRepository repository;

    public AlertExpirationScheduler(AlertRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedRate = 5, timeUnit = TimeUnit.MINUTES)
    @Transactional
    public void expireOverdueAlerts() {
        List<Alert> overdue = repository.findByActiveTrueAndExpirationDateBefore(Instant.now());
        overdue.forEach(Alert::deactivate);
        repository.saveAll(overdue);
    }
}
