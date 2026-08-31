package com.alagou.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * User-uploaded photos are served from a path the browser must never be allowed to content-sniff or
 * treat as a downloadable/active document.
 */
public class UploadPhotoHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "inline");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=86400");

        String path = request.getRequestURI();
        if (path.endsWith(".png")) {
            response.setContentType(MediaType.IMAGE_PNG_VALUE);
        } else {
            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        }

        filterChain.doFilter(request, response);
    }
}
