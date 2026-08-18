package com.alagou.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class RateLimitingFilterTest {

    private RateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RateLimitingFilter(new ObjectMapper());
    }

    @Test
    void allowsRequestsUpToTheLimitThenBlocks() throws Exception {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 5; i++) {
            MockHttpServletRequest request = alertCreationRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertThat(response.getStatus()).isEqualTo(200);
        }
        verify(chain, times(5)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());

        MockHttpServletRequest sixthRequest = alertCreationRequest();
        MockHttpServletResponse sixthResponse = new MockHttpServletResponse();
        filter.doFilter(sixthRequest, sixthResponse, chain);

        assertThat(sixthResponse.getStatus()).isEqualTo(429);
        verify(chain, times(5)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void doesNotRateLimitUnmatchedRoutes() throws Exception {
        FilterChain chain = mock(FilterChain.class);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/alerts");
        MockHttpServletResponse response = new MockHttpServletResponse();

        for (int i = 0; i < 20; i++) {
            filter.doFilter(request, response, chain);
        }

        verify(chain, times(20)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    private MockHttpServletRequest alertCreationRequest() {
        return new MockHttpServletRequest("POST", "/api/alerts");
    }
}
