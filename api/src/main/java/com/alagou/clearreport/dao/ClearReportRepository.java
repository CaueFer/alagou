package com.alagou.clearreport.dao;

import com.alagou.clearreport.ClearReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface ClearReportRepository extends JpaRepository<ClearReport, Long> {
    boolean existsByAlertIdAndUsername(Long alertId, String username);
    long countByAlertId(Long alertId);

    @Query("select cr.alertId, count(cr) from ClearReport cr where cr.alertId in :alertIds group by cr.alertId")
    List<Object[]> countByAlertIdIn(Collection<Long> alertIds);

    @Query("select count(distinct cr.username) from ClearReport cr where cr.alertId = :alertId")
    long countDistinctUsernameByAlertId(Long alertId);

    @Query("select count(distinct cr.sourceIp) from ClearReport cr where cr.alertId = :alertId")
    long countDistinctSourceIpByAlertId(Long alertId);
}
