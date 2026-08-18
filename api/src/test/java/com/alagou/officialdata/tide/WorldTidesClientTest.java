package com.alagou.officialdata.tide;

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

class WorldTidesClientTest {

    private static final String BASE_URL = "https://www.worldtides.info/api/v3";

    @Test
    void parsesExtremesResponse() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        WorldTidesClient client = new WorldTidesClient(builder, BASE_URL, "test-key", -26.2439, -48.6386);

        String body = """
                {"status":200,"extremes":[
                  {"dt":1755518400,"date":"2026-08-18T12:00:00+000","height":1.42,"type":"High"},
                  {"dt":1755540000,"date":"2026-08-18T18:00:00+000","height":0.21,"type":"Low"}
                ]}
                """;

        server.expect(method(HttpMethod.GET))
                .andExpect(requestTo(BASE_URL + "?extremes=&days=7&lat=-26.2439&lon=-48.6386&key=test-key"))
                .andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        List<TideExtreme> extremes = client.fetchExtremes(7);

        assertThat(extremes).hasSize(2);
        assertThat(extremes.get(0).dateTime()).isEqualTo(Instant.ofEpochSecond(1755518400L));
        assertThat(extremes.get(0).heightMeters()).isEqualTo(1.42);
        assertThat(extremes.get(0).type()).isEqualTo(TideType.HIGH);
        assertThat(extremes.get(1).type()).isEqualTo(TideType.LOW);
    }
}
