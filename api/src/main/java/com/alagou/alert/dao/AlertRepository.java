package com.alagou.alert.dao;

import com.alagou.alert.Alert;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByExpirationDateBefore(Instant now, Sort sort);
    List<Alert> findByExpirationDateGreaterThanEqual(Instant now, Sort sort);
}
