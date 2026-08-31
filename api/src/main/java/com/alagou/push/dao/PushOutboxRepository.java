package com.alagou.push.dao;

import com.alagou.push.PushOutbox;
import com.alagou.push.PushEventType;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PushOutboxRepository extends JpaRepository<PushOutbox, Long> {

    boolean existsByDedupKey(String dedupKey);

    // Hibernate maps lock timeout -2 to FOR UPDATE SKIP LOCKED on PostgreSQL
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "-2"))
    @Query("select o from PushOutbox o where o.status = com.alagou.push.PushOutboxStatus.PENDING order by o.createdAt")
    List<PushOutbox> claimPending(Pageable pageable);

    @Query("select count(o) > 0 from PushOutbox o where o.eventType = :eventType and o.dedupKey like concat(:dedupPrefix, '%') and o.createdAt >= :since")
    boolean existsRecentWithDedupPrefix(
            @Param("eventType") PushEventType eventType,
            @Param("dedupPrefix") String dedupPrefix,
            @Param("since") Instant since);
}
