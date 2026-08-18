package com.alagou.security;

import com.alagou.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int TOO_MANY_REQUESTS = 429;

    private static final List<RateLimitRule> RULES = List.of(
            new RateLimitRule("POST", "/api/alerts", 5),
            new RateLimitRule("POST", "/api/alerts/*/confirmations", 20),
            new RateLimitRule("POST", "/api/alerts/*/clear-reports", 10)
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        RateLimitRule rule = matchRule(request);
        if (rule == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Bucket bucket = buckets.computeIfAbsent(rule.bucketKey(resolveIdentity(request)), key -> newBucket(rule.limitPerHour()));
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            respondTooManyRequests(response);
        }
    }

    private RateLimitRule matchRule(HttpServletRequest request) {
        return RULES.stream()
                .filter(rule -> rule.method().equalsIgnoreCase(request.getMethod())
                        && pathMatcher.match(rule.pathPattern(), request.getRequestURI()))
                .findFirst()
                .orElse(null);
    }

    private String resolveIdentity(HttpServletRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            return authentication.getPrincipal().toString();
        }
        return request.getRemoteAddr();
    }

    private Bucket newBucket(int limitPerHour) {
        Bandwidth limit = Bandwidth.classic(limitPerHour, Refill.intervally(limitPerHour, Duration.ofHours(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private void respondTooManyRequests(HttpServletResponse response) throws IOException {
        response.setStatus(TOO_MANY_REQUESTS);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(
                new ErrorResponse("Too many requests", "Limite de requisições excedido. Tente novamente mais tarde.")));
    }

    private record RateLimitRule(String method, String pathPattern, int limitPerHour) {
        String bucketKey(String identity) {
            return method + ":" + pathPattern + ":" + identity;
        }
    }
}
