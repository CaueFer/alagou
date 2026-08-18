package com.alagou.officialdata.river;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class AnaHidrowebClientTest {

    private static final String BASE_URL = "https://www.ana.gov.br/hidrowebservice";

    @Test
    void authenticateExtractsTokenFromItems() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        AnaHidrowebClient client = new AnaHidrowebClient(builder, BASE_URL, "user", "pass");

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(BASE_URL + "/EstacoesTelemetricas/OAUth/v1"))
                .andExpect(header("Identificador", "user"))
                .andExpect(header("Senha", "pass"))
                .andRespond(withSuccess("""
                        {"status":"200 OK","code":200,"message":"ok","items":{"tokenautenticacao":"abc123"}}
                        """, MediaType.APPLICATION_JSON));

        assertThat(client.authenticate()).isEqualTo("abc123");
    }

    @Test
    void authenticateThrowsWhenTokenFieldIsMissing() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        AnaHidrowebClient client = new AnaHidrowebClient(builder, BASE_URL, "user", "pass");

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(BASE_URL + "/EstacoesTelemetricas/OAUth/v1"))
                .andRespond(withSuccess("""
                        {"status":"200 OK","code":200,"message":"ok","items":{}}
                        """, MediaType.APPLICATION_JSON));

        assertThatThrownBy(client::authenticate).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void fetchLatestReadingsSendsBearerTokenAndStationCodes() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        AnaHidrowebClient client = new AnaHidrowebClient(builder, BASE_URL, "user", "pass");

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(BASE_URL + "/EstacoesTelemetricas/HidroinfoanaSerieTelemetricaAdotada/v2"
                        + "?Codigos_Estacoes=82274000,82270060&Tipo%20Filtro%20Data=DATA_ULTIMA_ATUALIZACAO&Range%20Intervalo%20de%20busca=HORA_24"))
                .andExpect(header("Authorization", "Bearer abc123"))
                .andRespond(withSuccess("""
                        {"status":"200 OK","code":200,"message":"ok","items":[]}
                        """, MediaType.APPLICATION_JSON));

        JsonNode response = client.fetchLatestReadings(List.of(
                RiverStation.CACHOEIRA.code(), RiverStation.CUBATAO.code()), "abc123");

        assertThat(response.path("code").asInt()).isEqualTo(200);
    }
}
