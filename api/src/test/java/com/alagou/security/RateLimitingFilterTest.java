package com.alagou.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class RateLimitingFilterTest {

    private RateLimitingFilter filterWithoutProxies() {
        return new RateLimitingFilter(new ObjectMapper(), new ClientIpResolver(List.of()));
    }

    @Test
    void allowsRequestsUpToTheLimitThenBlocks() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("POST", "/api/alerts"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }
        verify(chain, times(5)).doFilter(any(), any());

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("POST", "/api/alerts"), blocked, chain);

        assertThat(blocked.getStatus()).isEqualTo(429);
        assertThat(blocked.getHeader("Retry-After")).isNotNull();
        assertThat(Integer.parseInt(blocked.getHeader("Retry-After"))).isGreaterThan(0);
        verify(chain, times(5)).doFilter(any(), any());
    }

    @Test
    void rateLimitsWeatherReads() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 30; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("GET", "/api/weather"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("GET", "/api/weather"), blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    void appliesGlobalCatchAllCapToUnmatchedRoutes() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 300; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("GET", "/api/zones"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("GET", "/api/zones"), blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    void doesNotRateLimitServedPhotos() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 500; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("GET", "/uploads/photos/" + i + ".jpg"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }
        verify(chain, times(500)).doFilter(any(), any());
    }

    @Test
    void normalizesPathBeforeMatchingRules() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/alerts");
            request.setRequestURI(i % 2 == 0 ? "/api/alerts/" : "//api/alerts");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest sixth = new MockHttpServletRequest("POST", "/api/alerts");
        sixth.setRequestURI("/api/alerts//");
        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(sixth, blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    void hardensClearReportsToFivePerHour() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(new MockHttpServletRequest("POST", "/api/alerts/7/clear-reports"), response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("POST", "/api/alerts/7/clear-reports"), blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    void ignoresForwardedForWhenPeerIsNotATrustedProxy() throws Exception {
        RateLimitingFilter filter = filterWithoutProxies();
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 30; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/weather");
            request.setRemoteAddr("198.51.100.5");
            request.addHeader("X-Forwarded-For", "203.0.113." + i);
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/weather");
        request.setRemoteAddr("198.51.100.5");
        request.addHeader("X-Forwarded-For", "203.0.113.250");
        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(request, blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    void usesFirstForwardedForHopWhenPeerIsATrustedProxy() throws Exception {
        RateLimitingFilter filter = new RateLimitingFilter(new ObjectMapper(),
                new ClientIpResolver(List.of("10.0.0.0/8")));
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 30; i++) {
            MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/weather");
            request.setRemoteAddr("10.1.2.3");
            request.addHeader("X-Forwarded-For", "203.0.113.7, 10.1.2.3");
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest sameClient = new MockHttpServletRequest("GET", "/api/weather");
        sameClient.setRemoteAddr("10.1.2.3");
        sameClient.addHeader("X-Forwarded-For", "203.0.113.7, 10.1.2.3");
        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilter(sameClient, blocked, chain);
        assertThat(blocked.getStatus()).isEqualTo(429);

        MockHttpServletRequest otherClient = new MockHttpServletRequest("GET", "/api/weather");
        otherClient.setRemoteAddr("10.1.2.3");
        otherClient.addHeader("X-Forwarded-For", "198.51.100.42, 10.1.2.3");
        MockHttpServletResponse allowed = new MockHttpServletResponse();
        filter.doFilter(otherClient, allowed, chain);
        assertThat(allowed.getStatus()).isEqualTo(200);
    }

    @Test
    void normalizePathCollapsesSlashesAndTrimsTrailingSlash() {
        assertThat(RateLimitingFilter.normalizePath("//api//alerts//")).isEqualTo("/api/alerts");
        assertThat(RateLimitingFilter.normalizePath("/api/weather")).isEqualTo("/api/weather");
        assertThat(RateLimitingFilter.normalizePath("/")).isEqualTo("/");
    }
}
