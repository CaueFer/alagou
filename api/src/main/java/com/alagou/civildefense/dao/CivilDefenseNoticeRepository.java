package com.alagou.civildefense.dao;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface CivilDefenseNoticeRepository extends JpaRepository<CivilDefenseNotice, Long> {
    Optional<CivilDefenseNotice> findByExternalId(long externalId);
    List<CivilDefenseNotice> findAllByOrderByPublishedAtDesc();
    List<CivilDefenseNotice> findByPublishedAtAfterOrderByPublishedAtDesc(Instant since);
    long countByRiskLevelInAndPublishedAtAfter(List<CivilDefenseRiskLevel> levels, Instant since);
}
