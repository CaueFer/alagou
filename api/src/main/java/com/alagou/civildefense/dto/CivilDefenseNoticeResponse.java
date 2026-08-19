package com.alagou.civildefense.dto;

import com.alagou.civildefense.CivilDefenseRiskLevel;

import java.time.Instant;

public record CivilDefenseNoticeResponse(
        Long id,
        String title,
        String excerpt,
        String content,
        String link,
        CivilDefenseRiskLevel riskLevel,
        Instant publishedAt
) {}
