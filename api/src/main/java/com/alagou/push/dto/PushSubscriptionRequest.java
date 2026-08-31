package com.alagou.push.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PushSubscriptionRequest(
        @NotBlank String endpoint,
        @NotNull @Valid Keys keys,
        Boolean nearbyEnabled,
        Boolean climaticEnabled,
        Boolean civilDefenseEnabled
) {
    public record Keys(
            @NotBlank String p256dh,
            @NotBlank String auth
    ) {}
}
