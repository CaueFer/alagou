package com.alagou.officialdata.civildefense;

import java.time.Instant;

public record CivilDefenseNewsItem(
        long id,
        Instant publishedAt,
        String link,
        String title,
        String excerpt,
        String content
) {}
