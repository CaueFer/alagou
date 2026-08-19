package com.alagou.civildefense.dao;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface CivilDefenseNoticeRepository extends JpaRepository<CivilDefenseNotice, Long> {
    boolean existsByExternalId(long externalId);
    List<CivilDefenseNotice> findAllByOrderByPublishedAtDesc();
    long countByRiskLevelInAndPublishedAtAfter(List<CivilDefenseRiskLevel> levels, Instant since);
}
