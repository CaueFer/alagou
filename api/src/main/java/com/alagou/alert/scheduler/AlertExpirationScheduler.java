package com.alagou.alert.scheduler;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static net.logstash.logback.argument.StructuredArguments.kv;

@Component
public class AlertExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(AlertExpirationScheduler.class);

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
        if (!overdue.isEmpty()) {
            log.info("Expired overdue alerts {}", kv("count", overdue.size()));
        }
    }
}
