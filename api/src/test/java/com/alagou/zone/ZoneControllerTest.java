package com.alagou.zone;

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
        ZoneData data = new ZoneData(
                "central",
                "Zona Central",
                List.of(),
                new TideData(1.5, Instant.now(), "HIGH_TIDE"),
                new CivilDefenseData(1, List.of(), Instant.now()),
                Instant.now()
        );

        when(zoneService.getAllZoneData()).thenReturn(List.of(data));

        mockMvc.perform(get("/api/zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zoneId").value("central"))
                .andExpect(jsonPath("$[0].zoneName").value("Zona Central"));
    }
}
