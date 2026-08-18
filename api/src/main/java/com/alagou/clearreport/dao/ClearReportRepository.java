package com.alagou.clearreport.dao;

import com.alagou.clearreport.ClearReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClearReportRepository extends JpaRepository<ClearReport, Long> {
    boolean existsByAlertIdAndUsername(Long alertId, String username);
    long countByAlertId(Long alertId);
}
