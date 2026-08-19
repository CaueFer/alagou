package com.alagou.civildefense.scheduler;

import com.alagou.civildefense.service.CivilDefenseNoticeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class CivilDefenseNoticeScheduler {

    private static final Logger log = LoggerFactory.getLogger(CivilDefenseNoticeScheduler.class);

    private final CivilDefenseNoticeService service;

    public CivilDefenseNoticeScheduler(CivilDefenseNoticeService service) {
        this.service = service;
    }

    @Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES)
    public void ingestNotices() {
        try {
            service.ingestNotices();
            log.info("Civil defense notice ingestion completed");
        } catch (Exception e) {
            log.error("Failed to ingest civil defense notices", e);
        }
    }
}
