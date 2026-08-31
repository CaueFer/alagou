package com.alagou.security;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.LowLevelHttpRequest;
import com.google.api.client.http.LowLevelHttpResponse;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * google-http-client's {@code NetHttpTransport} is final and the Google ID token verifier exposes no
 * hook to set connect/read timeouts on the on-demand fetch of Google's signing certificates, leaving
 * that call on the library default of 20s. This transport is built on the JDK HTTP client purely so
 * the certificate fetch honours the tight timeouts configured in {@link GoogleIdTokenVerifierService}.
 */
final class TimeBoundedHttpTransport extends HttpTransport {

    private static final Set<String> RESTRICTED_HEADERS =
            Set.of("connection", "content-length", "expect", "host", "upgrade");

    private final HttpClient client;
    private final Duration readTimeout;

    TimeBoundedHttpTransport(Duration connectTimeout, Duration readTimeout) {
        this.client = HttpClient.newBuilder().connectTimeout(connectTimeout).build();
        this.readTimeout = readTimeout;
    }

    @Override
    protected LowLevelHttpRequest buildRequest(String method, String url) {
        return new Request(method, url);
    }

    private final class Request extends LowLevelHttpRequest {

        private final String method;
        private final String url;
        private final List<String> headerNames = new ArrayList<>();
        private final List<String> headerValues = new ArrayList<>();

        Request(String method, String url) {
            this.method = method;
            this.url = url;
        }

        @Override
        public void addHeader(String name, String value) {
            if (!RESTRICTED_HEADERS.contains(name.toLowerCase())) {
                headerNames.add(name);
                headerValues.add(value);
            }
        }

        @Override
        public LowLevelHttpResponse execute() throws IOException {
            byte[] body = new byte[0];
            if (getStreamingContent() != null) {
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                getStreamingContent().writeTo(buffer);
                body = buffer.toByteArray();
            }

            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(url))
                    .timeout(readTimeout)
                    .method(method, body.length == 0
                            ? HttpRequest.BodyPublishers.noBody()
                            : HttpRequest.BodyPublishers.ofByteArray(body));
            if (getContentType() != null) {
                builder.header("Content-Type", getContentType());
            }
            for (int i = 0; i < headerNames.size(); i++) {
                builder.header(headerNames.get(i), headerValues.get(i));
            }

            try {
                return new Response(client.send(builder.build(), HttpResponse.BodyHandlers.ofByteArray()));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("Interrupted while calling " + url, e);
            }
        }
    }

    private static final class Response extends LowLevelHttpResponse {

        private final HttpResponse<byte[]> response;
        private final List<String> headerNames = new ArrayList<>();
        private final List<String> headerValues = new ArrayList<>();

        Response(HttpResponse<byte[]> response) {
            this.response = response;
            response.headers().map().forEach((name, values) ->
                    values.forEach(value -> {
                        headerNames.add(name);
                        headerValues.add(value);
                    }));
        }

        @Override
        public InputStream getContent() {
            return new ByteArrayInputStream(response.body());
        }

        @Override
        public String getContentEncoding() {
            return response.headers().firstValue("Content-Encoding").orElse(null);
        }

        @Override
        public long getContentLength() {
            return response.headers().firstValueAsLong("Content-Length").orElse(-1);
        }

        @Override
        public String getContentType() {
            return response.headers().firstValue("Content-Type").orElse(null);
        }

        @Override
        public String getStatusLine() {
            return null;
        }

        @Override
        public int getStatusCode() {
            return response.statusCode();
        }

        @Override
        public String getReasonPhrase() {
            return null;
        }

        @Override
        public int getHeaderCount() {
            return headerNames.size();
        }

        @Override
        public String getHeaderName(int index) {
            return headerNames.get(index);
        }

        @Override
        public String getHeaderValue(int index) {
            return headerValues.get(index);
        }
    }
}
