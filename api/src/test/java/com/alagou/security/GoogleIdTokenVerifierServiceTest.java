package com.alagou.security;

import com.alagou.exception.InvalidCredentialsException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GoogleIdTokenVerifierServiceTest {

    private final GoogleIdTokenVerifierService service = new GoogleIdTokenVerifierService("client-id");

    @Test
    void rejectsPayloadWithUnverifiedEmail() {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("sub-1");
        payload.setEmail("citizen@example.com");
        payload.setEmailVerified(false);

        assertThatThrownBy(() -> service.extractUserInfo(payload))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void rejectsPayloadWithMissingEmailVerifiedClaim() {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("sub-1");
        payload.setEmail("citizen@example.com");

        assertThatThrownBy(() -> service.extractUserInfo(payload))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void extractsUserInfoWhenEmailVerified() {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("sub-1");
        payload.setEmail("citizen@example.com");
        payload.setEmailVerified(true);
        payload.set("name", "Citizen");
        payload.set("picture", "https://example.com/p.png");

        GoogleUserInfo info = service.extractUserInfo(payload);

        assertThat(info.googleId()).isEqualTo("sub-1");
        assertThat(info.email()).isEqualTo("citizen@example.com");
        assertThat(info.name()).isEqualTo("Citizen");
        assertThat(info.pictureUrl()).isEqualTo("https://example.com/p.png");
    }
}
