package com.alagou.confirmation.service;

import com.alagou.alert.Alert;
import com.alagou.alert.dao.AlertRepository;
import com.alagou.confirmation.Confirmation;
import com.alagou.confirmation.dao.ConfirmationRepository;
import com.alagou.confirmation.dto.ConfirmationResponse;
import com.alagou.exception.BusinessRuleException;
import com.alagou.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class ConfirmationService {

    private static final long RENEWAL_MINUTES = 45;

    private final ConfirmationRepository repository;
    private final AlertRepository alertRepository;

    public ConfirmationService(ConfirmationRepository repository, AlertRepository alertRepository) {
        this.repository = repository;
        this.alertRepository = alertRepository;
    }

    @Transactional
    public ConfirmationResponse create(Long alertId, String username, String sourceIp) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));

        if (alert.getUsername().equals(username)) {
            throw new BusinessRuleException("A user cannot confirm their own alert");
        }
        if (repository.existsByAlertIdAndUsername(alertId, username)) {
            throw new BusinessRuleException("User has already confirmed this alert");
        }

        Confirmation confirmation;
        try {
            confirmation = repository.saveAndFlush(new Confirmation(alertId, username, sourceIp, Instant.now()));
        } catch (DataIntegrityViolationException ex) {
            throw new BusinessRuleException("User has already confirmed this alert");
        }

        alert.renewExpiration(Instant.now().plus(RENEWAL_MINUTES, ChronoUnit.MINUTES));
        alertRepository.save(alert);

        return new ConfirmationResponse(confirmation.getId(), confirmation.getAlertId(), confirmation.getUsername(),
                confirmation.getCreatedAt(), alert.getExpirationDate());
    }
}
