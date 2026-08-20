package com.alagou.civildefense.service;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.officialdata.civildefense.CivilDefenseNewsClient;
import com.alagou.officialdata.civildefense.CivilDefenseNewsItem;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CivilDefenseNoticeService {

    private static final String SEARCH_KEYWORD = "alagamento";
    private static final int SEARCH_LIMIT = 20;

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "emergencia", "evacuacao", "estado de emergencia", "critico");
    private static final List<String> ALERT_KEYWORDS = List.of(
            "alerta", "perigo", "interdicao", "bloqueio");

    private final CivilDefenseNoticeRepository repository;
    private final CivilDefenseNewsClient client;

    public CivilDefenseNoticeService(CivilDefenseNoticeRepository repository, CivilDefenseNewsClient client) {
        this.repository = repository;
        this.client = client;
    }

    public List<CivilDefenseNoticeResponse> listNotices() {
        return repository.findAllByOrderByPublishedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public void ingestNotices() {
        List<CivilDefenseNewsItem> items = client.searchRecent(SEARCH_KEYWORD, SEARCH_LIMIT);
        for (CivilDefenseNewsItem item : items) {
            Optional<CivilDefenseNotice> existing = repository.findByExternalId(item.id());
            if (existing.isPresent()) {
                backfillThumbnail(existing.get(), item.thumbnailUrl());
                continue;
            }

            CivilDefenseNotice notice = new CivilDefenseNotice(
                    item.id(),
                    item.title(),
                    item.excerpt(),
                    item.content(),
                    item.link(),
                    item.thumbnailUrl(),
                    classifyRiskLevel(item.title()),
                    item.publishedAt(),
                    Instant.now()
            );
            repository.save(notice);
        }
    }

    private void backfillThumbnail(CivilDefenseNotice notice, String thumbnailUrl) {
        if (notice.getThumbnailUrl() == null && thumbnailUrl != null) {
            notice.setThumbnailUrl(thumbnailUrl);
            repository.save(notice);
        }
    }

    private CivilDefenseRiskLevel classifyRiskLevel(String title) {
        String normalized = title.toLowerCase();

        if (EMERGENCY_KEYWORDS.stream().anyMatch(normalized::contains)) {
            return CivilDefenseRiskLevel.EMERGENCY;
        }
        if (ALERT_KEYWORDS.stream().anyMatch(normalized::contains)) {
            return CivilDefenseRiskLevel.ALERT;
        }
        return CivilDefenseRiskLevel.ATTENTION;
    }

    private CivilDefenseNoticeResponse toResponse(CivilDefenseNotice notice) {
        return new CivilDefenseNoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getExcerpt(),
                notice.getContent(),
                notice.getLink(),
                notice.getThumbnailUrl(),
                notice.getRiskLevel(),
                notice.getPublishedAt()
        );
    }
}
