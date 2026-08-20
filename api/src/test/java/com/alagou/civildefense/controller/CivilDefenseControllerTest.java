package com.alagou.civildefense.controller;

import com.alagou.civildefense.CivilDefenseRiskLevel;
import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.civildefense.service.CivilDefenseNoticeService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CivilDefenseController.class)
@AutoConfigureMockMvc(addFilters = false)
class CivilDefenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CivilDefenseNoticeService service;

    @Test
    void shouldReturnNotices() throws Exception {
        CivilDefenseNoticeResponse notice = new CivilDefenseNoticeResponse(
                1L,
                "Defesa Civil alerta para risco de alagamentos",
                "resumo",
                "conteudo",
                "https://www.joinville.sc.gov.br/noticias/defesa-civil-alerta/",
                "https://www.joinville.sc.gov.br/wp-content/uploads/2026/08/defesa-civil.jpeg",
                CivilDefenseRiskLevel.ALERT,
                Instant.now()
        );

        when(service.listNotices()).thenReturn(List.of(notice));

        mockMvc.perform(get("/api/civil-defense/notices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Defesa Civil alerta para risco de alagamentos"))
                .andExpect(jsonPath("$[0].riskLevel").value("ALERT"));
    }
}
