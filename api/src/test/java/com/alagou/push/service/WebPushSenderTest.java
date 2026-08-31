package com.alagou.push.service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Security;
import java.security.spec.ECGenParameterSpec;
import java.time.Instant;

import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.message.BasicHttpResponse;
import org.apache.http.message.BasicStatusLine;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alagou.push.PushSendResult;
import com.alagou.push.PushSubscription;

import nl.martijndwars.webpush.Base64Encoder;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WebPushSenderTest {

    private PushService pushService;
    private WebPushSender sender;
    private PushSubscription subscription;

    @BeforeAll
    static void registerProvider() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @BeforeEach
    void setUp() throws Exception {
        pushService = mock(PushService.class);
        sender = new WebPushSender(pushService);
        subscription = new PushSubscription(
                "https://push.example/endpoint", validPublicKey(), validAuth(), true, true, true, Instant.now());
    }

    @Test
    void mapsGoneStatusToGone() throws Exception {
        when(pushService.send(any(Notification.class))).thenReturn(response(410));

        assertThat(sender.send(subscription, "{}")).isEqualTo(PushSendResult.GONE);
    }

    @Test
    void mapsNotFoundStatusToGone() throws Exception {
        when(pushService.send(any(Notification.class))).thenReturn(response(404));

        assertThat(sender.send(subscription, "{}")).isEqualTo(PushSendResult.GONE);
    }

    @Test
    void mapsServerErrorToTransientFailure() throws Exception {
        when(pushService.send(any(Notification.class))).thenReturn(response(503));

        assertThat(sender.send(subscription, "{}")).isEqualTo(PushSendResult.TRANSIENT_FAILURE);
    }

    @Test
    void mapsSuccessStatusToSuccess() throws Exception {
        when(pushService.send(any(Notification.class))).thenReturn(response(201));

        assertThat(sender.send(subscription, "{}")).isEqualTo(PushSendResult.SUCCESS);
    }

    @Test
    void mapsThrownExceptionToTransientFailure() throws Exception {
        when(pushService.send(any(Notification.class))).thenThrow(new java.io.IOException("timeout"));

        assertThat(sender.send(subscription, "{}")).isEqualTo(PushSendResult.TRANSIENT_FAILURE);
    }

    private static HttpResponse response(int status) {
        return new BasicHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1, status, "reason"));
    }

    private static String validPublicKey() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("ECDH", BouncyCastleProvider.PROVIDER_NAME);
        generator.initialize(new ECGenParameterSpec("prime256v1"));
        KeyPair keyPair = generator.generateKeyPair();
        return Base64Encoder.encodeUrlWithoutPadding(Utils.encode((ECPublicKey) keyPair.getPublic()));
    }

    private static String validAuth() {
        return Base64Encoder.encodeUrlWithoutPadding(new byte[16]);
    }
}
