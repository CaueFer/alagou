package com.alagou.officialdata.river;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenMeteoFloodClientTest {

    private static final String BASE_URL = "https://flood-api.open-meteo.com/v1/flood";

    @Test
    void readsCurrentDischargeAndForecastPeak() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoFloodClient client = new OpenMeteoFloodClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andExpect(queryParam("latitude", "-26.301"))
                .andExpect(queryParam("longitude", "-48.847"))
                .andExpect(queryParam("daily", "river_discharge"))
                .andExpect(queryParam("forecast_days", "3"))
                .andRespond(withSuccess("""
                        {"daily":{"time":["2026-08-28","2026-08-29","2026-08-30"],
                         "river_discharge":[0.47,2.16,1.72]}}
                        """, MediaType.APPLICATION_JSON));

        RiverDischargeReading reading = client.fetchDischarge(-26.301, -48.847);

        assertThat(reading.dischargeCubicMetersPerSecond()).isEqualTo(0.47);
        assertThat(reading.forecastPeakCubicMetersPerSecond()).isEqualTo(2.16);
        assertThat(reading.observedAt()).isEqualTo(Instant.parse("2026-08-28T00:00:00Z"));
    }

    @Test
    void ignoresNullEntriesWhenComputingPeak() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoFloodClient client = new OpenMeteoFloodClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        {"daily":{"time":["2026-08-28","2026-08-29"],"river_discharge":[null,3.5]}}
                        """, MediaType.APPLICATION_JSON));

        RiverDischargeReading reading = client.fetchDischarge(-26.301, -48.847);

        assertThat(reading.dischargeCubicMetersPerSecond()).isNull();
        assertThat(reading.forecastPeakCubicMetersPerSecond()).isEqualTo(3.5);
    }

    @Test
    void failsWhenSeriesIsMissing() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoFloodClient client = new OpenMeteoFloodClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andRespond(withSuccess("{\"error\":true}", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.fetchDischarge(-26.301, -48.847))
                .isInstanceOf(IllegalStateException.class);
    }
}
