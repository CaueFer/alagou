package com.alagou.security;

import com.alagou.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int TOO_MANY_REQUESTS = 429;

    private static final List<RateLimitRule> RULES = List.of(
            new RateLimitRule("POST", "/api/alerts", 5, Duration.ofHours(1)),
            new RateLimitRule("POST", "/api/alerts/*/confirmations", 20, Duration.ofHours(1)),
            new RateLimitRule("POST", "/api/alerts/*/clear-reports", 5, Duration.ofHours(1)),
            new RateLimitRule("POST", "/api/auth/register", 5, Duration.ofHours(1)),
            new RateLimitRule("POST", "/api/auth/login", 10, Duration.ofMinutes(15)),
            new RateLimitRule("POST", "/api/auth/google", 10, Duration.ofMinutes(15)),
            new RateLimitRule("GET", "/api/weather", 30, Duration.ofMinutes(1))
    );

    private static final int GLOBAL_LIMIT = 300;
    private static final Duration GLOBAL_WINDOW = Duration.ofMinutes(5);

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final com.github.benmanes.caffeine.cache.Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofHours(2))
            .maximumSize(100_000)
            .build();
    private final ObjectMapper objectMapper;
    private final ClientIpResolver clientIpResolver;

    public RateLimitingFilter(ObjectMapper objectMapper, ClientIpResolver clientIpResolver) {
        this.objectMapper = objectMapper;
        this.clientIpResolver = clientIpResolver;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = normalizePath(request.getRequestURI());
        RateLimitRule rule = matchRule(request.getMethod(), path);

        String bucketKey;
        int limit;
        Duration window;
        if (rule != null) {
            bucketKey = rule.method() + " " + rule.pathPattern() + " " + resolveIdentity(request);
            limit = rule.limit();
            window = rule.window();
        } else if (path.startsWith("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        } else {
            bucketKey = "GLOBAL " + clientIpResolver.resolve(request);
            limit = GLOBAL_LIMIT;
            window = GLOBAL_WINDOW;
        }

        Bucket bucket = buckets.get(bucketKey, key -> newBucket(limit, window));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
        } else {
            respondTooManyRequests(response, probe.getNanosToWaitForRefill());
        }
    }

    static String normalizePath(String uri) {
        String path = uri.replaceAll("/{2,}", "/");
        if (path.length() > 1 && path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        return path;
    }

    private RateLimitRule matchRule(String method, String path) {
        return RULES.stream()
                .filter(rule -> rule.method().equalsIgnoreCase(method)
                        && pathMatcher.match(rule.pathPattern(), path))
                .findFirst()
                .orElse(null);
    }

    private String resolveIdentity(HttpServletRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            return authentication.getPrincipal().toString();
        }
        return clientIpResolver.resolve(request);
    }

    private Bucket newBucket(int limit, Duration window) {
        Bandwidth bandwidth = Bandwidth.classic(limit, Refill.intervally(limit, window));
        return Bucket.builder().addLimit(bandwidth).build();
    }

    private void respondTooManyRequests(HttpServletResponse response, long nanosToWaitForRefill) throws IOException {
        long retryAfterSeconds = Math.max(1, nanosToWaitForRefill / 1_000_000_000L);
        response.setStatus(TOO_MANY_REQUESTS);
        response.setHeader(HttpHeaders.RETRY_AFTER, Long.toString(retryAfterSeconds));
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(
                new ErrorResponse("Too many requests", "Limite de requisições excedido. Tente novamente mais tarde.")));
    }

    private record RateLimitRule(String method, String pathPattern, int limit, Duration window) {
    }
}
