package com.alagou.push.dto;

import com.alagou.push.PushCategory;

public record PushEvent(
        String dedupKey,
        PushCategory category,
        PushPayload payload
) {}
