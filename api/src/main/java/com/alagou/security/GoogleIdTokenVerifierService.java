package com.alagou.security;

import com.alagou.exception.InvalidCredentialsException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Duration;
import java.util.Collections;

@Component
public class GoogleIdTokenVerifierService {

    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(3);
    private static final Duration READ_TIMEOUT = Duration.ofSeconds(5);

    private final String clientId;
    private GoogleIdTokenVerifier verifier;

    public GoogleIdTokenVerifierService(@Value("${app.security.google.client-id}") String clientId) {
        this.clientId = clientId;
    }

    @PostConstruct
    void init() {
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new TimeBoundedHttpTransport(CONNECT_TIMEOUT, READ_TIMEOUT),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleUserInfo verify(String idTokenString) {
        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (GeneralSecurityException | IOException | IllegalArgumentException ex) {
            throw new InvalidCredentialsException("Não foi possível validar o token do Google");
        }

        if (idToken == null) {
            throw new InvalidCredentialsException("Token do Google inválido ou expirado");
        }

        return extractUserInfo(idToken.getPayload());
    }

    GoogleUserInfo extractUserInfo(GoogleIdToken.Payload payload) {
        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new InvalidCredentialsException("E-mail do Google não verificado");
        }

        String pictureUrl = (String) payload.get("picture");
        String name = (String) payload.get("name");

        return new GoogleUserInfo(payload.getSubject(), payload.getEmail(), name, pictureUrl);
    }
}
