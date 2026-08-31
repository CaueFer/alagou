package com.alagou.push.dto;

public record PushSubscriptionResponse(
        String endpoint,
        boolean nearbyEnabled,
        boolean climaticEnabled,
        boolean civilDefenseEnabled
) {}
