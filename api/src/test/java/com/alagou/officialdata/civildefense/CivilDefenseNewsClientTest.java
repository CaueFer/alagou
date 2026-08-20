package com.alagou.officialdata.civildefense;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestToUriTemplate;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class CivilDefenseNewsClientTest {

    private static final String BASE_URL = "https://www.joinville.sc.gov.br/index.php/wp-json/wp/v2/noticia";

    @Test
    void parsesWordpressResponseIntoNewsItems() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CivilDefenseNewsClient client = new CivilDefenseNewsClient(builder, BASE_URL);

        String body = """
                [{"id":205363,"date_gmt":"2026-08-13T11:24:36","link":"https://www.joinville.sc.gov.br/noticias/defesa-civil-alerta/","title":{"rendered":"Defesa Civil de Joinville alerta para risco de alagamentos"},"excerpt":{"rendered":"Resumo do aviso"},"content":{"rendered":"<p>Texto completo do aviso</p>"},"_embedded":{"wp:featuredmedia":[{"source_url":"https://www.joinville.sc.gov.br/wp-content/uploads/2026/08/defesa-civil.jpeg"}]}}]
                """;

        server.expect(method(org.springframework.http.HttpMethod.GET))
                .andExpect(requestToUriTemplate(BASE_URL + "?search={kw}&orderby=date&order=desc&per_page={n}&_embed=wp:featuredmedia&_fields=id,date_gmt,link,title,excerpt,content,_links,_embedded", "alagamento", 10))
                .andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        List<CivilDefenseNewsItem> items = client.searchRecent("alagamento", 10);

        assertThat(items).hasSize(1);
        CivilDefenseNewsItem item = items.get(0);
        assertThat(item.id()).isEqualTo(205363);
        assertThat(item.publishedAt()).isEqualTo(Instant.parse("2026-08-13T11:24:36Z"));
        assertThat(item.title()).isEqualTo("Defesa Civil de Joinville alerta para risco de alagamentos");
        assertThat(item.excerpt()).isEqualTo("Resumo do aviso");
        assertThat(item.content()).isEqualTo("<p>Texto completo do aviso</p>");
        assertThat(item.thumbnailUrl()).isEqualTo("https://www.joinville.sc.gov.br/wp-content/uploads/2026/08/defesa-civil.jpeg");
    }

    @Test
    void parsesItemsWithNullExcerpt() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CivilDefenseNewsClient client = new CivilDefenseNewsClient(builder, BASE_URL);

        String body = """
                [{"id":205363,"date_gmt":"2026-08-13T11:24:36","link":"https://www.joinville.sc.gov.br/noticias/defesa-civil-alerta/","title":{"rendered":"Defesa Civil de Joinville alerta para risco de alagamentos"},"excerpt":null,"content":{"rendered":"<p>Texto completo do aviso</p>"}}]
                """;

        server.expect(method(org.springframework.http.HttpMethod.GET))
                .andExpect(requestToUriTemplate(BASE_URL + "?search={kw}&orderby=date&order=desc&per_page={n}&_embed=wp:featuredmedia&_fields=id,date_gmt,link,title,excerpt,content,_links,_embedded", "alagamento", 10))
                .andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        List<CivilDefenseNewsItem> items = client.searchRecent("alagamento", 10);

        assertThat(items).hasSize(1);
        assertThat(items.get(0).excerpt()).isNull();
        assertThat(items.get(0).thumbnailUrl()).isNull();
    }
}
