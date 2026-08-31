package com.alagou.push.controller;

import java.time.Instant;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import com.alagou.push.PushSubscription;
import com.alagou.push.config.PushProperties;
import com.alagou.push.service.PushSubscriptionService;
import com.alagou.security.ClientIpResolver;
import com.alagou.security.RateLimitingFilter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PushController.class)
@AutoConfigureMockMvc(addFilters = false)
class PushControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PushSubscriptionService subscriptionService;

    @MockBean
    private PushProperties properties;

    private PushSubscription subscription() {
        return new PushSubscription("https://push/endpoint", "p256", "auth", true, false, true, Instant.now());
    }

    @Test
    void createsSubscriptionAndReturns201() throws Exception {
        when(subscriptionService.upsert(any(), any(), any(), any(), any(), any()))
                .thenReturn(new PushSubscriptionService.UpsertResult(subscription(), true));

        mockMvc.perform(post("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"https://push/endpoint","keys":{"p256dh":"p256","auth":"auth"}}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.endpoint").value("https://push/endpoint"))
                .andExpect(jsonPath("$.climaticEnabled").value(false));
    }

    @Test
    void upsertReturns200WhenSubscriptionAlreadyExisted() throws Exception {
        when(subscriptionService.upsert(any(), any(), any(), any(), any(), any()))
                .thenReturn(new PushSubscriptionService.UpsertResult(subscription(), false));

        mockMvc.perform(post("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"https://push/endpoint","keys":{"p256dh":"p256","auth":"auth"}}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void rejectsSubscriptionWithBlankEndpoint() throws Exception {
        mockMvc.perform(post("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"","keys":{"p256dh":"p256","auth":"auth"}}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsSubscriptionWithMissingKeys() throws Exception {
        mockMvc.perform(post("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"https://push/endpoint"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updatesFlagsAndReturnsCurrentState() throws Exception {
        when(subscriptionService.updateFlags(any(), any(Boolean.class), any(Boolean.class), any(Boolean.class)))
                .thenReturn(subscription());

        mockMvc.perform(put("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"https://push/endpoint","nearbyEnabled":true,"climaticEnabled":false,"civilDefenseEnabled":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.climaticEnabled").value(false));
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/api/push/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"endpoint":"https://push/endpoint"}
                                """))
                .andExpect(status().isNoContent());

        verify(subscriptionService).delete("https://push/endpoint");
    }

    @Test
    void exposesVapidPublicKey() throws Exception {
        PushProperties.Vapid vapid = new PushProperties.Vapid();
        vapid.setPublicKey("BExamplePublicKey");
        when(properties.getVapid()).thenReturn(vapid);

        mockMvc.perform(post("/api/push/subscriptions").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/push/vapid-public-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("BExamplePublicKey"));
    }

    @Test
    void rateLimitRuleBlocksSubscriptionPostAfterThirtyRequestsPerIp() throws Exception {
        RateLimitingFilter filter = new RateLimitingFilter(new ObjectMapper(), new ClientIpResolver(List.of()));
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 30; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("POST", "/api/push/subscriptions"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("POST", "/api/push/subscriptions"), blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }
}
