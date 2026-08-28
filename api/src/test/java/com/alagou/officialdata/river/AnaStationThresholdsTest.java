package com.alagou.officialdata.river;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

import static org.assertj.core.api.Assertions.assertThat;

class AnaStationThresholdsTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TestConfig.class)
            .withPropertyValues(
                    "app.officialdata.ana.stations.s82274000.name=Rio Cachoeira",
                    "app.officialdata.ana.stations.s82274000.attention=2.0",
                    "app.officialdata.ana.stations.s82274000.alert=2.8",
                    "app.officialdata.ana.stations.s82274000.overflow=3.5",
                    "app.officialdata.ana.stations.s82270060.name=Rio Cubatao",
                    "app.officialdata.ana.stations.s82270060.attention=3.0",
                    "app.officialdata.ana.stations.s82270060.alert=4.0",
                    "app.officialdata.ana.stations.s82270060.overflow=5.0"
            );

    @Test
    void bindsThresholdsPerStationByCode() {
        contextRunner.run(context -> {
            assertThat(context).hasSingleBean(AnaStationThresholds.class);
            AnaStationThresholds thresholds = context.getBean(AnaStationThresholds.class);

            StationThresholds cachoeira = thresholds.forStation("82274000");
            assertThat(cachoeira.getName()).isEqualTo("Rio Cachoeira");
            assertThat(cachoeira.getAttention()).isEqualTo(2.0);
            assertThat(cachoeira.getAlert()).isEqualTo(2.8);
            assertThat(cachoeira.getOverflow()).isEqualTo(3.5);

            StationThresholds cubatao = thresholds.forStation("82270060");
            assertThat(cubatao.getName()).isEqualTo("Rio Cubatao");
            assertThat(cubatao.getAttention()).isEqualTo(3.0);
            assertThat(cubatao.getAlert()).isEqualTo(4.0);
            assertThat(cubatao.getOverflow()).isEqualTo(5.0);

            assertThat(thresholds.forStation("99999999")).isNull();
        });
    }

    @Configuration
    @EnableConfigurationProperties(AnaStationThresholds.class)
    static class TestConfig {
    }
}