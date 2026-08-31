package com.alagou.push.listener;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.alagou.push.PushDelivery;
import com.alagou.push.PushDeliveryStatus;
import com.alagou.push.PushSendResult;
import com.alagou.push.PushSubscription;
import com.alagou.push.PushTransientException;
import com.alagou.push.config.PushProperties;
import com.alagou.push.config.PushRabbitConfig;
import com.alagou.push.dao.PushDeliveryRepository;
import com.alagou.push.dao.PushSubscriptionRepository;
import com.alagou.push.dto.PushSendBatch;
import com.alagou.push.service.WebPushSender;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@ConditionalOnProperty(name = "app.push.enabled", havingValue = "true")
public class PushSendListener {

    private static final Logger log = LoggerFactory.getLogger(PushSendListener.class);

    private final PushSubscriptionRepository subscriptionRepository;
    private final PushDeliveryRepository deliveryRepository;
    private final WebPushSender webPushSender;
    private final PushProperties properties;
    private final ObjectMapper objectMapper;

    public PushSendListener(PushSubscriptionRepository subscriptionRepository,
                            PushDeliveryRepository deliveryRepository,
                            WebPushSender webPushSender,
                            PushProperties properties,
                            ObjectMapper objectMapper) {
        this.subscriptionRepository = subscriptionRepository;
        this.deliveryRepository = deliveryRepository;
        this.webPushSender = webPushSender;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = PushRabbitConfig.SEND_QUEUE, containerFactory = PushRabbitConfig.SEND_LISTENER_FACTORY)
    public void onBatch(PushSendBatch batch) {
        String payloadJson = serialize(batch);
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        boolean anyTransient = false;

        for (Long subscriptionId : batch.subscriptionIds()) {
            if (deliveryRepository.existsBySubscriptionIdAndDedupKey(subscriptionId, batch.dedupKey())) {
                continue;
            }

            Optional<PushSubscription> found = subscriptionRepository.findById(subscriptionId);
            if (found.isEmpty()) {
                continue;
            }
            PushSubscription subscription = found.get();

            if (subscription.isDailyCapReached(today, properties.getDailyCap())) {
                log.debug("Subscription {} skipped: daily cap {} reached", subscriptionId, properties.getDailyCap());
                continue;
            }

            PushSendResult result = webPushSender.send(subscription, payloadJson);
            switch (result) {
                case GONE -> {
                    subscriptionRepository.delete(subscription);
                    log.debug("Subscription {} removed after GONE response", subscriptionId);
                }
                case SUCCESS -> {
                    subscription.registerSent(today);
                    subscriptionRepository.save(subscription);
                    deliveryRepository.save(new PushDelivery(
                            subscriptionId, batch.dedupKey(), Instant.now(), PushDeliveryStatus.SENT));
                }
                case TRANSIENT_FAILURE -> anyTransient = true;
            }
        }

        if (anyTransient) {
            throw new PushTransientException("At least one delivery in batch " + batch.dedupKey() + " failed transiently");
        }
    }

    private String serialize(PushSendBatch batch) {
        try {
            return objectMapper.writeValueAsString(batch.payload());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize push payload for batch " + batch.dedupKey(), e);
        }
    }
}
