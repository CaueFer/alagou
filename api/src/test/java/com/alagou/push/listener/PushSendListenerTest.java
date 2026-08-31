package com.alagou.push.listener;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alagou.push.PushDelivery;
import com.alagou.push.PushSendResult;
import com.alagou.push.PushSubscription;
import com.alagou.push.PushTransientException;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dao.PushDeliveryRepository;
import com.alagou.push.dao.PushSubscriptionRepository;
import com.alagou.push.dto.PushPayload;
import com.alagou.push.dto.PushSendBatch;
import com.alagou.push.PushCategory;
import com.alagou.push.service.WebPushSender;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PushSendListenerTest {

    @Mock
    private PushSubscriptionRepository subscriptionRepository;

    @Mock
    private PushDeliveryRepository deliveryRepository;

    @Mock
    private WebPushSender webPushSender;

    private PushProperties properties;
    private PushSendListener listener;

    @BeforeEach
    void setUp() {
        properties = new PushProperties();
        properties.setDailyCap(15);
        listener = new PushSendListener(subscriptionRepository, deliveryRepository, webPushSender, properties, new ObjectMapper());
    }

    private PushSendBatch batch(Long... ids) {
        return new PushSendBatch("climatic:centro:ALERT:1", List.of(ids),
                new PushPayload("t", "b", "/", "climatic:centro:ALERT:1", PushCategory.CLIMATIC));
    }

    private PushSubscription subscription() {
        return new PushSubscription("https://push/endpoint", "p256", "auth", true, true, true, Instant.now());
    }

    @Test
    void skipsSubscriptionAlreadyDeliveredForDedupKey() {
        when(deliveryRepository.existsBySubscriptionIdAndDedupKey(1L, "climatic:centro:ALERT:1")).thenReturn(true);

        listener.onBatch(batch(1L));

        verifyNoInteractions(webPushSender);
        verify(subscriptionRepository, never()).findById(any());
    }

    @Test
    void skipsSubscriptionThatReachedDailyCap() {
        properties.setDailyCap(1);
        PushSubscription subscription = subscription();
        subscription.registerSent(LocalDate.now(ZoneOffset.UTC));
        when(subscriptionRepository.findById(2L)).thenReturn(Optional.of(subscription));

        listener.onBatch(batch(2L));

        verifyNoInteractions(webPushSender);
        verify(deliveryRepository, never()).save(any());
    }

    @Test
    void deletesSubscriptionWhenWebPushReportsGone() {
        PushSubscription subscription = subscription();
        when(subscriptionRepository.findById(3L)).thenReturn(Optional.of(subscription));
        when(webPushSender.send(any(PushSubscription.class), anyString())).thenReturn(PushSendResult.GONE);

        listener.onBatch(batch(3L));

        verify(subscriptionRepository).delete(subscription);
        verify(deliveryRepository, never()).save(any());
    }

    @Test
    void recordsDeliveryAndIncrementsCounterOnSuccess() {
        PushSubscription subscription = subscription();
        when(subscriptionRepository.findById(4L)).thenReturn(Optional.of(subscription));
        when(webPushSender.send(any(PushSubscription.class), anyString())).thenReturn(PushSendResult.SUCCESS);

        listener.onBatch(batch(4L));

        verify(deliveryRepository).save(any(PushDelivery.class));
        verify(subscriptionRepository).save(subscription);
        assertThat(subscription.getDailySentCount()).isEqualTo(1);
    }

    @Test
    void rethrowsWhenAnyDeliveryFailsTransiently() {
        PushSubscription subscription = subscription();
        when(subscriptionRepository.findById(5L)).thenReturn(Optional.of(subscription));
        when(webPushSender.send(any(PushSubscription.class), anyString())).thenReturn(PushSendResult.TRANSIENT_FAILURE);

        assertThatThrownBy(() -> listener.onBatch(batch(5L)))
                .isInstanceOf(PushTransientException.class);
    }
}
