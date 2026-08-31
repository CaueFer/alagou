package com.alagou.push.controller;

import com.alagou.push.PushSubscription;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dto.PushSubscriptionDeleteRequest;
import com.alagou.push.dto.PushSubscriptionRequest;
import com.alagou.push.dto.PushSubscriptionResponse;
import com.alagou.push.dto.PushSubscriptionUpdateRequest;
import com.alagou.push.dto.VapidPublicKeyResponse;
import com.alagou.push.service.PushSubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final PushSubscriptionService subscriptionService;
    private final PushProperties properties;

    public PushController(PushSubscriptionService subscriptionService, PushProperties properties) {
        this.subscriptionService = subscriptionService;
        this.properties = properties;
    }

    @GetMapping("/vapid-public-key")
    public VapidPublicKeyResponse vapidPublicKey() {
        return new VapidPublicKeyResponse(properties.getVapid().getPublicKey());
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<PushSubscriptionResponse> subscribe(@Valid @RequestBody PushSubscriptionRequest request) {
        PushSubscriptionService.UpsertResult result = subscriptionService.upsert(
                request.endpoint(),
                request.keys().p256dh(),
                request.keys().auth(),
                request.nearbyEnabled(),
                request.climaticEnabled(),
                request.civilDefenseEnabled()
        );
        HttpStatus status = result.created() ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(toResponse(result.subscription()));
    }

    @PutMapping("/subscriptions")
    public PushSubscriptionResponse updateFlags(@Valid @RequestBody PushSubscriptionUpdateRequest request) {
        PushSubscription subscription = subscriptionService.updateFlags(
                request.endpoint(),
                request.nearbyEnabled(),
                request.climaticEnabled(),
                request.civilDefenseEnabled()
        );
        return toResponse(subscription);
    }

    @DeleteMapping("/subscriptions")
    public ResponseEntity<Void> unsubscribe(@Valid @RequestBody PushSubscriptionDeleteRequest request) {
        subscriptionService.delete(request.endpoint());
        return ResponseEntity.noContent().build();
    }

    private static PushSubscriptionResponse toResponse(PushSubscription subscription) {
        return new PushSubscriptionResponse(
                subscription.getEndpoint(),
                subscription.isNearbyEnabled(),
                subscription.isClimaticEnabled(),
                subscription.isCivilDefenseEnabled()
        );
    }
}
