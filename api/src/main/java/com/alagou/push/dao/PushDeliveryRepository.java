package com.alagou.push.dao;

import com.alagou.push.PushDelivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushDeliveryRepository extends JpaRepository<PushDelivery, Long> {
    boolean existsBySubscriptionIdAndDedupKey(Long subscriptionId, String dedupKey);
}
