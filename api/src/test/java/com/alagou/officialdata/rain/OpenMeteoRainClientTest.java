package com.alagou.officialdata.rain;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OpenMeteoRainClientTest {

    private static final String BASE_URL = "https://api.open-meteo.com/v1/forecast";

    private String hourlyResponse() {
        String times = IntStream.rangeClosed(0, 24)
                .mapToObj(hour -> "\"2026-08-27T%02d:00\"".formatted(hour % 24))
                .collect(Collectors.joining(","));
        String values = IntStream.rangeClosed(0, 24)
                .mapToObj(hour -> hour == 23 ? "5.0" : (hour == 24 ? "9.9" : "1.0"))
                .collect(Collectors.joining(","));
        return "{\"hourly\":{\"time\":[%s],\"precipitation\":[%s]}}".formatted(times, values);
    }

    @Test
    void accumulatesCompletedPastHoursAndIgnoresForecastHour() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoRainClient client = new OpenMeteoRainClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andExpect(queryParam("latitude", "-26.301"))
                .andExpect(queryParam("longitude", "-48.847"))
                .andExpect(queryParam("hourly", "precipitation"))
                .andExpect(queryParam("past_hours", "24"))
                .andExpect(queryParam("forecast_hours", "1"))
                .andRespond(withSuccess(hourlyResponse(), MediaType.APPLICATION_JSON));

        ForecastRainReading reading = client.fetchRain(-26.301, -48.847);

        assertThat(reading.accumulated1hMm()).isEqualTo(5.0);
        assertThat(reading.accumulated24hMm()).isEqualTo(28.0);
    }

    @Test
    void readsObservedAtFromLastTimestamp() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoRainClient client = new OpenMeteoRainClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        {"hourly":{"time":["2026-08-28T14:00","2026-08-28T15:00"],"precipitation":[2.0,3.0]}}
                        """, MediaType.APPLICATION_JSON));

        ForecastRainReading reading = client.fetchRain(-26.301, -48.847);

        assertThat(reading.observedAt()).isEqualTo(Instant.parse("2026-08-28T15:00:00Z"));
        assertThat(reading.accumulated24hMm()).isEqualTo(5.0);
        assertThat(reading.accumulated1hMm()).isEqualTo(3.0);
    }

    @Test
    void failsWhenSeriesIsMissing() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        OpenMeteoRainClient client = new OpenMeteoRainClient(builder, BASE_URL);

        server.expect(method(HttpMethod.GET))
                .andRespond(withSuccess("{\"error\":true}", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.fetchRain(-26.301, -48.847))
                .isInstanceOf(IllegalStateException.class);
    }
}
