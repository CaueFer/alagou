package com.alagou.officialdata.civildefense;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

record WordpressNoticiaResponse(
        long id,
        @JsonProperty("date_gmt") String dateGmt,
        String link,
        Rendered title,
        Rendered excerpt,
        Rendered content,
        @JsonProperty("_embedded") Embedded embedded
) {
    record Rendered(String rendered) {}

    // _links must be requested alongside _embedded in _fields, otherwise the WordPress
    // API silently omits _embedded even when _embed is present in the query.
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Embedded(@JsonProperty("wp:featuredmedia") List<FeaturedMedia> featuredMedia) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record FeaturedMedia(@JsonProperty("source_url") String sourceUrl) {}
}
