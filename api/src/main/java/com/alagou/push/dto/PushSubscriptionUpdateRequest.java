package com.alagou.push.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PushSubscriptionUpdateRequest(
        @NotBlank String endpoint,
        @NotNull Boolean nearbyEnabled,
        @NotNull Boolean climaticEnabled,
        @NotNull Boolean civilDefenseEnabled
) {}
