package com.alagou.officialdata.rain;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class CemadenRainClientTest {

    private static final String CATALOG_URL = "https://resources.cemaden.gov.br/dados/311_24.json";
    private static final String READINGS_URL = "https://resources.cemaden.gov.br/graficos/interativo/getJson2.php";
    private static final int JOINVILLE_IBGE_CODE = 4209102;

    private static final String CATALOG_BODY = """
            estacoes([{"estacao":[
              {"idestacao":6262,"codibge":4209102,"cidade":"JOINVILLE","nomeestacao":"Centro","latitude":-26.301,"longitude":-48.841},
              {"idestacao":6960,"codibge":4209102,"cidade":"JOINVILLE","nomeestacao":"Nova Brasília","latitude":-26.3309,"longitude":-48.875},
              {"idestacao":3975,"codibge":4208203,"cidade":"ITAJAÍ","nomeestacao":"Fazenda","latitude":-26.9,"longitude":-48.66}
            ]}])
            """;

    private static final String READINGS_BODY = """
            [
              {"idestacao":6262,"codibge":4209102,"cidade":"JOINVILLE","nomeestacao":"Centro","ultimovalor":0.2,"datahoraUltimovalor":"28/08/26 14:50","acc1hr":0.4,"acc24hr":12.6},
              {"idestacao":6960,"codibge":4209102,"cidade":"JOINVILLE","nomeestacao":"Nova Brasília","ultimovalor":0,"datahoraUltimovalor":"28/08/26 15:10","acc1hr":"-","acc24hr":"-"},
              {"idestacao":3975,"codibge":4208203,"cidade":"ITAJAÍ","nomeestacao":"Fazenda","ultimovalor":0,"datahoraUltimovalor":"28/08/26 14:50","acc1hr":"-","acc24hr":3.0}
            ]
            """;

    private CemadenRainClient client(RestClient.Builder builder) {
        return new CemadenRainClient(builder, new ObjectMapper(), CATALOG_URL, READINGS_URL,
                "SC", JOINVILLE_IBGE_CODE);
    }

    @Test
    void keepsOnlyCityStationsAndJoinsCoordinatesFromCatalog() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CemadenRainClient client = client(builder);

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(CATALOG_URL))
                .andRespond(withSuccess(CATALOG_BODY, MediaType.APPLICATION_JSON));
        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(READINGS_URL + "?uf=SC"))
                .andRespond(withSuccess(READINGS_BODY, MediaType.TEXT_HTML));

        List<CemadenRainReading> readings = client.fetchCityReadings();

        assertThat(readings).hasSize(2);
        assertThat(readings).extracting(reading -> reading.station().name())
                .containsExactly("Centro", "Nova Brasília");
        assertThat(readings.get(0).station().latitude()).isEqualTo(-26.301);
        assertThat(readings.get(0).station().longitude()).isEqualTo(-48.841);
    }

    @Test
    void readsAccumulationsAndTreatsDashAsMissing() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CemadenRainClient client = client(builder);

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(CATALOG_URL))
                .andRespond(withSuccess(CATALOG_BODY, MediaType.APPLICATION_JSON));
        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(READINGS_URL + "?uf=SC"))
                .andRespond(withSuccess(READINGS_BODY, MediaType.TEXT_HTML));

        List<CemadenRainReading> readings = client.fetchCityReadings();

        CemadenRainReading centro = readings.get(0);
        assertThat(centro.lastValueMm()).isEqualTo(0.2);
        assertThat(centro.accumulated1hMm()).isEqualTo(0.4);
        assertThat(centro.accumulated24hMm()).isEqualTo(12.6);
        assertThat(centro.observedAt()).isEqualTo(Instant.parse("2026-08-28T14:50:00Z"));

        CemadenRainReading novaBrasilia = readings.get(1);
        assertThat(novaBrasilia.accumulated1hMm()).isNull();
        assertThat(novaBrasilia.accumulated24hMm()).isNull();
    }

    @Test
    void reusesCachedCatalogAcrossCalls() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        CemadenRainClient client = client(builder);

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(CATALOG_URL))
                .andRespond(withSuccess(CATALOG_BODY, MediaType.APPLICATION_JSON));
        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(READINGS_URL + "?uf=SC"))
                .andRespond(withSuccess(READINGS_BODY, MediaType.TEXT_HTML));
        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(READINGS_URL + "?uf=SC"))
                .andRespond(withSuccess(READINGS_BODY, MediaType.TEXT_HTML));

        client.fetchCityReadings();
        client.fetchCityReadings();

        server.verify();
    }
}
