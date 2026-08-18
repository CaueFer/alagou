package com.alagou.security;

import com.alagou.exception.InvalidCredentialsException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.GeneralSecurityException;
import java.util.Collections;

@Component
public class GoogleIdTokenVerifierService {

    private final String clientId;
    private GoogleIdTokenVerifier verifier;

    public GoogleIdTokenVerifierService(@Value("${app.security.google.client-id}") String clientId) {
        this.clientId = clientId;
    }

    @PostConstruct
    void init() throws GeneralSecurityException, java.io.IOException {
        this.verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleUserInfo verify(String idTokenString) {
        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (GeneralSecurityException | java.io.IOException | IllegalArgumentException ex) {
            throw new InvalidCredentialsException("Não foi possível validar o token do Google");
        }

        if (idToken == null) {
            throw new InvalidCredentialsException("Token do Google inválido ou expirado");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String pictureUrl = (String) payload.get("picture");
        String name = (String) payload.get("name");

        return new GoogleUserInfo(payload.getSubject(), payload.getEmail(), name, pictureUrl);
    }
}
