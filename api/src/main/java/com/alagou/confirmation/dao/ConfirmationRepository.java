package com.alagou.confirmation.dao;

import com.alagou.confirmation.Confirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface ConfirmationRepository extends JpaRepository<Confirmation, Long> {
    boolean existsByAlertIdAndUsername(Long alertId, String username);
    long countByAlertId(Long alertId);

    @Query("select c.alertId, count(c) from Confirmation c where c.alertId in :alertIds group by c.alertId")
    List<Object[]> countByAlertIdIn(Collection<Long> alertIds);
}
