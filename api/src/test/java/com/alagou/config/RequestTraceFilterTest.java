package com.alagou.config;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RequestTraceFilterTest {

    private final RequestTraceFilter filter = new RequestTraceFilter();
    private final Logger logger = (Logger) LoggerFactory.getLogger(RequestTraceFilter.class);
    private final ListAppender<ILoggingEvent> appender = new ListAppender<>();
    private final MockHttpServletResponse response = new MockHttpServletResponse();

    @BeforeEach
    void attachAppender() {
        appender.start();
        logger.addAppender(appender);
    }

    @AfterEach
    void detachAppender() {
        logger.detachAppender(appender);
        MDC.clear();
    }

    @Test
    void exposesCurrentTraceIdInResponseHeader() throws Exception {
        MDC.put("traceId", "abc123");

        filter.doFilter(request("/api/alerts"), response, new MockFilterChain());

        assertThat(response.getHeader(RequestTraceFilter.TRACE_ID_HEADER)).isEqualTo("abc123");
    }

    @Test
    void omitsHeaderWhenThereIsNoTrace() throws Exception {
        filter.doFilter(request("/api/alerts"), response, new MockFilterChain());

        assertThat(response.getHeader(RequestTraceFilter.TRACE_ID_HEADER)).isNull();
    }

    @Test
    void logsCompletionWithoutQueryStringValues() throws Exception {
        MockHttpServletRequest request = request("/api/weather");
        request.setQueryString("lat=-26.3&lng=-48.8");

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(appender.list).hasSize(1);
        ILoggingEvent event = appender.list.get(0);
        assertThat(event.getLevel()).isEqualTo(Level.INFO);
        assertThat(event.getFormattedMessage())
                .contains("method=GET", "path=/api/weather", "status=200", "durationMs=")
                .doesNotContain("-26.3", "-48.8");
    }

    @Test
    void logsErrorStatusAsError() throws Exception {
        response.setStatus(503);

        filter.doFilter(request("/api/zones"), response, new MockFilterChain());

        assertThat(appender.list.get(0).getLevel()).isEqualTo(Level.ERROR);
    }

    @Test
    void reportsPropagatedFailureAs500() {
        FilterChain failingChain = (req, res) -> {
            throw new ServletException("boom");
        };

        assertThatThrownBy(() -> filter.doFilter(request("/api/zones"), response, failingChain))
                .isInstanceOf(ServletException.class);

        assertThat(appender.list.get(0).getFormattedMessage()).contains("status=500");
    }

    @Test
    void skipsHighFrequencyPaths() throws Exception {
        filter.doFilter(request("/api/health"), new MockHttpServletResponse(), new MockFilterChain());
        filter.doFilter(request("/api/presence/heartbeat"), new MockHttpServletResponse(), new MockFilterChain());
        filter.doFilter(request("/uploads/photos/a.webp"), new MockHttpServletResponse(), new MockFilterChain());

        assertThat(appender.list).isEmpty();
    }

    private MockHttpServletRequest request(String path) {
        return new MockHttpServletRequest("GET", path);
    }
}
