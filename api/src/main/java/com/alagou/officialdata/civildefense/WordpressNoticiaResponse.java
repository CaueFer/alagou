package com.alagou.officialdata.civildefense;

import com.fasterxml.jackson.annotation.JsonProperty;

record WordpressNoticiaResponse(
        long id,
        @JsonProperty("date_gmt") String dateGmt,
        String link,
        Rendered title,
        Rendered excerpt,
        Rendered content
) {
    record Rendered(String rendered) {}
}
