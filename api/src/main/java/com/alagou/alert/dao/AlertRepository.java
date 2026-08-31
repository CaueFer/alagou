package com.alagou.alert.dao;

import com.alagou.alert.Alert;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long>, JpaSpecificationExecutor<Alert> {
    List<Alert> findByExpirationDateBefore(Instant now, Pageable pageable);
    List<Alert> findByActiveTrueAndExpirationDateGreaterThanEqual(Instant now, Pageable pageable);
    List<Alert> findByActiveTrueAndExpirationDateBefore(Instant now);

    long countByActiveTrue();

    long countByExpirationDateBefore(Instant now);

    @Query("select a.type, count(a) from Alert a group by a.type")
    List<Object[]> countAlertsByType();

    @Query("select a.severity, count(a) from Alert a group by a.severity")
    List<Object[]> countAlertsBySeverity();

    @Query(value = """
            SELECT EXISTS (
                SELECT 1 FROM alert a
                WHERE a.active = true
                AND a.username = :username
                AND ST_DWithin(a.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters)
            )
            """, nativeQuery = true)
    boolean existsActiveByUsernameWithinRadius(
            @Param("username") String username,
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusMeters") double radiusMeters);
}
