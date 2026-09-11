package com.alagou.officialdata;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
public class HttpClientConfig {

    @Bean
    public RestClientCustomizer outboundHttpTimeouts() {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(3))
                .withReadTimeout(Duration.ofSeconds(5));
        return builder -> builder.requestFactory(ClientHttpRequestFactories.get(settings));
    }

    // The Joinville city WordPress API (CivilDefenseNewsClient) is noticeably slower than the app's
    // other official data sources and routinely exceeds the app-wide 5s read timeout above. It's only
    // called from an hourly background job, not a user-facing request, so a longer timeout is acceptable.
    @Bean
    @Qualifier("civilDefenseNewsRestClientBuilder")
    public RestClient.Builder civilDefenseNewsRestClientBuilder() {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(3))
                .withReadTimeout(Duration.ofSeconds(20));
        return RestClient.builder().requestFactory(ClientHttpRequestFactories.get(settings));
    }
}
