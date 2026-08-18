package com.alagou.officialdata.river;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

// ANA's OpenAPI spec (ana.gov.br/hidrowebservice/api-docs) types the "items" response field
// as a bare object with no documented properties, so the token/reading field names below are
// a best-effort guess pending verification against a real account (see api/todo.md)
@Component
public class AnaHidrowebClient {

    private final RestClient restClient;
    private final String baseUrl;
    private final String identificador;
    private final String senha;

    public AnaHidrowebClient(
            RestClient.Builder builder,
            @Value("${app.officialdata.ana.base-url}") String baseUrl,
            @Value("${app.officialdata.ana.identificador}") String identificador,
            @Value("${app.officialdata.ana.senha}") String senha
    ) {
        this.restClient = builder.build();
        this.baseUrl = baseUrl;
        this.identificador = identificador;
        this.senha = senha;
    }

    public String authenticate() {
        JsonNode response = restClient.get()
                .uri(baseUrl + "/EstacoesTelemetricas/OAUth/v1")
                .header("Identificador", identificador)
                .header("Senha", senha)
                .retrieve()
                .body(JsonNode.class);

        JsonNode items = response != null ? response.path("items") : null;
        String token = items != null ? items.path("tokenautenticacao").asText(null) : null;
        if (token == null) {
            throw new IllegalStateException("ANA OAuth response did not contain the expected token field: " + response);
        }
        return token;
    }

    public JsonNode fetchLatestReadings(List<String> stationCodes, String token) {
        var uri = UriComponentsBuilder.fromUriString(baseUrl + "/EstacoesTelemetricas/HidroinfoanaSerieTelemetricaAdotada/v2")
                .queryParam("Codigos_Estacoes", String.join(",", stationCodes))
                .queryParam("Tipo Filtro Data", "DATA_ULTIMA_ATUALIZACAO")
                .queryParam("Range Intervalo de busca", "HORA_24")
                .build()
                .encode()
                .toUri();

        return restClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(JsonNode.class);
    }
}
