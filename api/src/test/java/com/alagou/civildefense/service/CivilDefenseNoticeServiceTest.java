package com.alagou.civildefense.service;

import com.alagou.civildefense.CivilDefenseNotice;
import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dao.CivilDefenseNoticeRepository;
import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.officialdata.civildefense.CivilDefenseNewsClient;
import com.alagou.officialdata.civildefense.CivilDefenseNewsItem;
import com.alagou.push.service.PushDispatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CivilDefenseNoticeServiceTest {

    @Mock
    private CivilDefenseNoticeRepository repository;

    @Mock
    private CivilDefenseNewsClient client;

    @Mock
    private PushDispatchService pushDispatchService;

    private CivilDefenseNoticeService service;

    @BeforeEach
    void setUp() {
        service = new CivilDefenseNoticeService(repository, client, pushDispatchService);
    }

    @Test
    void skipsIngestionWhenNoticeAlreadyExistsWithThumbnail() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(1L, Instant.now(), "link", "Aviso de alagamento", "resumo", "conteudo", "thumb.jpg");
        CivilDefenseNotice existing = new CivilDefenseNotice(1L, "Aviso de alagamento", "resumo", "conteudo", "link", "thumb.jpg",
                CivilDefenseRiskLevel.ATTENTION, Instant.now(), Instant.now());
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(1L)).thenReturn(Optional.of(existing));

        service.ingestNotices();

        verify(repository, never()).save(any(CivilDefenseNotice.class));
    }

    @Test
    void backfillsThumbnailWhenExistingNoticeHasNone() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(1L, Instant.now(), "link", "Aviso de alagamento", "resumo", "conteudo", "thumb.jpg");
        CivilDefenseNotice existing = new CivilDefenseNotice(1L, "Aviso de alagamento", "resumo", "conteudo", "link", null,
                CivilDefenseRiskLevel.ATTENTION, Instant.now(), Instant.now());
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(1L)).thenReturn(Optional.of(existing));

        service.ingestNotices();

        ArgumentCaptor<CivilDefenseNotice> captor = ArgumentCaptor.forClass(CivilDefenseNotice.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getThumbnailUrl()).isEqualTo("thumb.jpg");
    }

    @Test
    void classifiesEmergencyRiskLevelFromTitleKeywords() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(2L, Instant.now(), "link", "Estado de Emergencia decretado", "resumo", "conteudo", "thumb.jpg");
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(2L)).thenReturn(Optional.empty());

        service.ingestNotices();

        ArgumentCaptor<CivilDefenseNotice> captor = ArgumentCaptor.forClass(CivilDefenseNotice.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getRiskLevel()).isEqualTo(CivilDefenseRiskLevel.EMERGENCY);
    }

    @Test
    void dispatchesEmergencyPushForNewEmergencyNotice() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(9L, Instant.now(), "link", "Estado de Emergencia decretado", "resumo", "conteudo", "thumb.jpg");
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(9L)).thenReturn(Optional.empty());

        service.ingestNotices();

        ArgumentCaptor<CivilDefenseNotice> captor = ArgumentCaptor.forClass(CivilDefenseNotice.class);
        verify(pushDispatchService).publishCivilDefenseEmergency(captor.capture());
        assertThat(captor.getValue().getRiskLevel()).isEqualTo(CivilDefenseRiskLevel.EMERGENCY);
    }

    @Test
    void doesNotDispatchPushForNonEmergencyNotice() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(10L, Instant.now(), "link", "Alerta de risco em Joinville", "resumo", "conteudo", "thumb.jpg");
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(10L)).thenReturn(Optional.empty());

        service.ingestNotices();

        verify(pushDispatchService, never()).publishCivilDefenseEmergency(any());
    }

    @Test
    void classifiesAlertRiskLevelFromTitleKeywords() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(3L, Instant.now(), "link", "Alerta de risco em Joinville", "resumo", "conteudo", "thumb.jpg");
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(3L)).thenReturn(Optional.empty());

        service.ingestNotices();

        ArgumentCaptor<CivilDefenseNotice> captor = ArgumentCaptor.forClass(CivilDefenseNotice.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getRiskLevel()).isEqualTo(CivilDefenseRiskLevel.ALERT);
    }

    @Test
    void classifiesAttentionRiskLevelWhenNoKeywordMatches() {
        CivilDefenseNewsItem item = new CivilDefenseNewsItem(4L, Instant.now(), "link", "Chuvas previstas para o fim de semana", "resumo", "conteudo", "thumb.jpg");
        when(client.searchRecent("alagamento", 20)).thenReturn(List.of(item));
        when(repository.findByExternalId(4L)).thenReturn(Optional.empty());

        service.ingestNotices();

        ArgumentCaptor<CivilDefenseNotice> captor = ArgumentCaptor.forClass(CivilDefenseNotice.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getRiskLevel()).isEqualTo(CivilDefenseRiskLevel.ATTENTION);
    }

    @Test
    void listsNoticesOrderedByPublishedAtDescending() {
        CivilDefenseNotice recent = new CivilDefenseNotice(1L, "Aviso recente", "resumo", "conteudo", "link", "thumb.jpg",
                CivilDefenseRiskLevel.ATTENTION, Instant.now(), Instant.now());
        when(repository.findAllByOrderByPublishedAtDesc(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(List.of(recent));

        List<CivilDefenseNoticeResponse> result = service.listNotices();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Aviso recente");
        verify(repository, times(1)).findAllByOrderByPublishedAtDesc(any(org.springframework.data.domain.Pageable.class));
    }
}
