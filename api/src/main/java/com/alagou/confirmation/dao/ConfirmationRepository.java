package com.alagou.confirmation.dao;

import com.alagou.confirmation.Confirmation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationRepository extends JpaRepository<Confirmation, Long> {
    boolean existsByAlertIdAndUsername(Long alertId, String username);
    long countByAlertId(Long alertId);
}
