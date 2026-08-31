package com.alagou.push.dto;

import jakarta.validation.constraints.NotBlank;

public record PushSubscriptionDeleteRequest(
        @NotBlank String endpoint
) {}
