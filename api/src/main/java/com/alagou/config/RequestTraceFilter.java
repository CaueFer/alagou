package com.alagou.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static net.logstash.logback.argument.StructuredArguments.kv;

// Must run inside ServerHttpObservationFilter (HIGHEST_PRECEDENCE + 1), which is what puts traceId in the MDC.
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class RequestTraceFilter extends OncePerRequestFilter {

    static final String TRACE_ID_HEADER = "X-Trace-Id";

    private static final Logger log = LoggerFactory.getLogger(RequestTraceFilter.class);
    private static final String TRACE_ID_MDC_KEY = "traceId";
    private static final Set<String> UNLOGGED_PATHS = Set.of("/api/health", "/api/presence/heartbeat");
    private static final String UPLOADS_PREFIX = "/uploads/";
    private static final int INTERNAL_SERVER_ERROR = 500;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String traceId = MDC.get(TRACE_ID_MDC_KEY);
        if (traceId != null) {
            response.setHeader(TRACE_ID_HEADER, traceId);
        }

        long startedAt = System.nanoTime();
        int status = INTERNAL_SERVER_ERROR;
        try {
            filterChain.doFilter(request, response);
            status = response.getStatus();
        } finally {
            logCompletion(request, status, TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt));
        }
    }

    private void logCompletion(HttpServletRequest request, int status, long durationMs) {
        String path = request.getRequestURI();
        if (UNLOGGED_PATHS.contains(path) || path.startsWith(UPLOADS_PREFIX)) {
            return;
        }

        if (status >= INTERNAL_SERVER_ERROR) {
            log.error("Request completed {} {} {} {}",
                    kv("method", request.getMethod()), kv("path", path), kv("status", status), kv("durationMs", durationMs));
        } else {
            log.info("Request completed {} {} {} {}",
                    kv("method", request.getMethod()), kv("path", path), kv("status", status), kv("durationMs", durationMs));
        }
    }
}
