package com.alagou.push.dao;

import com.alagou.push.PushSubscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByEndpoint(String endpoint);
    Page<PushSubscription> findByNearbyEnabledTrue(Pageable pageable);
    Page<PushSubscription> findByClimaticEnabledTrue(Pageable pageable);
    Page<PushSubscription> findByCivilDefenseEnabledTrue(Pageable pageable);
}
