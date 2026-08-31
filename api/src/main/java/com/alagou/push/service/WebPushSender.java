package com.alagou.push.service;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.Security;

import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.alagou.push.PushSendResult;
import com.alagou.push.PushSubscription;
import com.alagou.push.config.PushProperties;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;

@Component
@ConditionalOnProperty(name = "app.push.enabled", havingValue = "true")
public class WebPushSender {

    private static final Logger log = LoggerFactory.getLogger(WebPushSender.class);

    private final PushService pushService;

    public WebPushSender(PushProperties properties) {
        this(buildPushService(properties));
    }

    WebPushSender(PushService pushService) {
        this.pushService = pushService;
    }

    public PushSendResult send(PushSubscription subscription, String payloadJson) {
        try {
            Notification notification = new Notification(
                    subscription.getEndpoint(),
                    subscription.getP256dh(),
                    subscription.getAuth(),
                    payloadJson.getBytes(StandardCharsets.UTF_8));
            HttpResponse response = pushService.send(notification);
            int status = response.getStatusLine().getStatusCode();
            return classify(status);
        } catch (Exception e) {
            log.warn("Web push delivery to subscription {} failed transiently: {}", subscription.getId(), e.toString());
            return PushSendResult.TRANSIENT_FAILURE;
        }
    }

    private static PushSendResult classify(int status) {
        if (status >= 200 && status < 300) {
            return PushSendResult.SUCCESS;
        }
        if (status == 404 || status == 410) {
            return PushSendResult.GONE;
        }
        return PushSendResult.TRANSIENT_FAILURE;
    }

    private static PushService buildPushService(PushProperties properties) {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        PushProperties.Vapid vapid = properties.getVapid();
        try {
            return new PushService(vapid.getPublicKey(), vapid.getPrivateKey(), vapid.getSubject());
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Invalid VAPID key pair for web push", e);
        }
    }
}
