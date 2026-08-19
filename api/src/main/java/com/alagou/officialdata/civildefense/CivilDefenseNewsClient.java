package com.alagou.officialdata.civildefense;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;

// /wp-json/... is blocked (403); /index.php/wp-json/... reaches the same WordPress REST API unblocked
@Component
public class CivilDefenseNewsClient {

    private final RestClient restClient;
    private final String baseUrl;

    public CivilDefenseNewsClient(RestClient.Builder builder, @Value("${app.officialdata.joinville.base-url}") String baseUrl) {
        this.restClient = builder
                .defaultHeader("User-Agent", "Mozilla/5.0 (compatible; AlagouApp/1.0)")
                .build();
        this.baseUrl = baseUrl;
    }

    public List<CivilDefenseNewsItem> searchRecent(String keyword, int perPage) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("search", keyword)
                .queryParam("orderby", "date")
                .queryParam("order", "desc")
                .queryParam("per_page", perPage)
                .queryParam("_fields", "id,date_gmt,link,title,excerpt,content")
                .build()
                .encode()
                .toUri();

        WordpressNoticiaResponse[] response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(WordpressNoticiaResponse[].class);

        if (response == null) {
            return List.of();
        }
        return Arrays.stream(response).map(this::toItem).toList();
    }

    private CivilDefenseNewsItem toItem(WordpressNoticiaResponse raw) {
        Instant publishedAt = LocalDateTime.parse(raw.dateGmt()).toInstant(ZoneOffset.UTC);
        return new CivilDefenseNewsItem(
                raw.id(),
                publishedAt,
                raw.link(),
                rendered(raw.title()),
                rendered(raw.excerpt()),
                rendered(raw.content())
        );
    }

    private String rendered(WordpressNoticiaResponse.Rendered field) {
        return field == null ? null : field.rendered();
    }
}
