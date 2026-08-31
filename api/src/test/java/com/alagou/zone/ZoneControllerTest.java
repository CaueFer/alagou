package com.alagou.zone;

import com.alagou.civildefense.CivilDefenseRiskLevel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ZoneController.class)
@AutoConfigureMockMvc(addFilters = false)
class ZoneControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ZoneService zoneService;

    @Test
    void shouldReturnZones() throws Exception {
        List<List<List<List<Double>>>> polygon = List.of(
                List.of(List.of(List.of(-48.8550, -26.2950), List.of(-48.8350, -26.2950), List.of(-48.8350, -26.3100), List.of(-48.8550, -26.2950)))
        );
        ZoneData data = new ZoneData(
                "central",
                "Zona Central",
                polygon,
                new RainData(RainWindow.of(4.0, 6.0), RainWindow.of(40.0, 60.0), List.of("Centro"),
                        RainStatus.ATTENTION, Instant.now()),
                new RiverData(0.47, 1.2, RiverStatus.NORMAL, Instant.now()),
                new TideData(1.5, Instant.now(), "HIGH_TIDE"),
                new CivilDefenseData(CivilDefenseRiskLevel.ALERT, List.of("Aviso"), Instant.now()),
                OverallStatus.ALERT,
                Instant.now()
        );

        when(zoneService.getAllZoneData()).thenReturn(List.of(data));

        mockMvc.perform(get("/api/zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zoneId").value("central"))
                .andExpect(jsonPath("$[0].zoneName").value("Zona Central"))
                .andExpect(jsonPath("$[0].polygon[0][0][0][0]").value(-48.8550))
                .andExpect(jsonPath("$[0].polygon[0][0][0][1]").value(-26.2950))
                .andExpect(jsonPath("$[0].rain.status").value("ATTENTION"))
                .andExpect(jsonPath("$[0].rain.last24Hours.averageMm").value(50.0))
                .andExpect(jsonPath("$[0].river.status").value("NORMAL"))
                .andExpect(jsonPath("$[0].river.dischargeCubicMetersPerSecond").value(0.47))
                .andExpect(jsonPath("$[0].tide.status").value("HIGH_TIDE"))
                .andExpect(jsonPath("$[0].civilDefense.riskLevel").value("ALERT"))
                .andExpect(jsonPath("$[0].overallStatus").value("ALERT"));
    }
}