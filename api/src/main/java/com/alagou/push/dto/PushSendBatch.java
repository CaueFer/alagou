package com.alagou.push.dto;

import java.util.List;

public record PushSendBatch(
        String dedupKey,
        List<Long> subscriptionIds,
        PushPayload payload
) {}
