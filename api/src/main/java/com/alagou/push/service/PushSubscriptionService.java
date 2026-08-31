package com.alagou.push.service;

import com.alagou.exception.ResourceNotFoundException;
import com.alagou.push.PushCategory;
import com.alagou.push.PushSubscription;
import com.alagou.push.dao.PushSubscriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class PushSubscriptionService {

    private final PushSubscriptionRepository repository;

    public PushSubscriptionService(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UpsertResult upsert(String endpoint, String p256dh, String auth,
                               Boolean nearbyEnabled, Boolean climaticEnabled, Boolean civilDefenseEnabled) {
        Optional<PushSubscription> existing = repository.findByEndpoint(endpoint);
        Instant now = Instant.now();
        if (existing.isPresent()) {
            PushSubscription subscription = existing.get();
            subscription.updateKeys(p256dh, auth, now);
            subscription.updateFlags(flag(nearbyEnabled), flag(climaticEnabled), flag(civilDefenseEnabled), now);
            subscription.markSeen(now);
            return new UpsertResult(repository.save(subscription), false);
        }

        PushSubscription subscription = new PushSubscription(
                endpoint, p256dh, auth,
                flag(nearbyEnabled), flag(climaticEnabled), flag(civilDefenseEnabled),
                now
        );
        return new UpsertResult(repository.save(subscription), true);
    }

    @Transactional
    public PushSubscription updateFlags(String endpoint, boolean nearbyEnabled, boolean climaticEnabled, boolean civilDefenseEnabled) {
        PushSubscription subscription = repository.findByEndpoint(endpoint)
                .orElseThrow(() -> new ResourceNotFoundException("Push subscription not found for endpoint"));
        subscription.updateFlags(nearbyEnabled, climaticEnabled, civilDefenseEnabled, Instant.now());
        return repository.save(subscription);
    }

    @Transactional
    public void delete(String endpoint) {
        repository.findByEndpoint(endpoint).ifPresent(repository::delete);
    }

    @Transactional(readOnly = true)
    public Page<PushSubscription> pageByCategory(PushCategory category, Pageable pageable) {
        return switch (category) {
            case NEARBY -> repository.findByNearbyEnabledTrue(pageable);
            case CLIMATIC -> repository.findByClimaticEnabledTrue(pageable);
            case CIVIL_DEFENSE -> repository.findByCivilDefenseEnabledTrue(pageable);
        };
    }

    private static boolean flag(Boolean value) {
        return value == null || value;
    }

    public record UpsertResult(PushSubscription subscription, boolean created) {}
}
