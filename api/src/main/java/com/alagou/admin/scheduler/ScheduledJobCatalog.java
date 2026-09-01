package com.alagou.admin.scheduler;

import java.time.Duration;
import java.util.List;

public final class ScheduledJobCatalog {

    private static final List<ScheduledJobDescriptor> JOBS = List.of(
            new ScheduledJobDescriptor(
                    "AlertExpirationScheduler.expireOverdueAlerts",
                    "Expiração de alertas",
                    "Desativa alertas expirados e mantém a lista pública consistente.",
                    "A cada 5 minutos",
                    Duration.ofMinutes(5)
            ),
            new ScheduledJobDescriptor(
                    "OfficialDataAggregationScheduler.aggregateOfficialData",
                    "Agregação de dados oficiais",
                    "Atualiza chuva, vazão, maré e dados da Defesa Civil por zona.",
                    "A cada 15 minutos",
                    Duration.ofMinutes(15)
            ),
            new ScheduledJobDescriptor(
                    "OfficialDataAggregationScheduler.refreshTideData",
                    "Atualização da maré",
                    "Recarrega a previsão de maré usada pela camada oficial.",
                    "Diário",
                    Duration.ofDays(1)
            ),
            new ScheduledJobDescriptor(
                    "CivilDefenseNoticeScheduler.ingestNotices",
                    "Ingestão de avisos da Defesa Civil",
                    "Busca os avisos oficiais mais recentes e atualiza o feed.",
                    "A cada 60 minutos",
                    Duration.ofHours(1)
            )
    );

    private ScheduledJobCatalog() {
    }

    public static List<ScheduledJobDescriptor> jobs() {
        return JOBS;
    }

    public record ScheduledJobDescriptor(
            String id,
            String name,
            String description,
            String interval,
            Duration cadence
    ) {
    }
}
