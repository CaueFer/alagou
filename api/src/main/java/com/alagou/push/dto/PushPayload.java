package com.alagou.push.dto;

import com.alagou.push.PushCategory;

public record PushPayload(
        String title,
        String body,
        String url,
        String tag,
        PushCategory category
) {}
