package com.alagou.feed;

import com.alagou.alert.AlertType;
import com.alagou.alert.dto.AlertResponse;
import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.zone.ZoneData;

import java.time.Instant;

public record RecentAlertResponse(
        String id,
        AlertType type,
        String summary,
        Double lat,
        Double lng,
        String locationLabel,
        Instant emittedAt,
        AlertResponse userAlert,
        CivilDefenseNoticeResponse civilDefenseNotice,
        ZoneData climaticZone
) {}
