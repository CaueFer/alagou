package com.alagou.push.listener;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.alagou.push.PushCategory;
import com.alagou.push.PushSubscription;
import com.alagou.push.config.PushProperties;
import com.alagou.push.dto.PushEvent;
import com.alagou.push.dto.PushPayload;
import com.alagou.push.dto.PushSendBatch;
import com.alagou.push.service.PushSubscriptionService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PushFanoutListenerTest {

    @Mock
    private PushSubscriptionService subscriptionService;

    @Mock
    private RabbitTemplate rabbitTemplate;

    private PushProperties properties;
    private PushFanoutListener listener;

    @BeforeEach
    void setUp() {
        properties = new PushProperties();
        listener = new PushFanoutListener(subscriptionService, rabbitTemplate, properties);
    }

    private PushSubscription subscription(long id) {
        PushSubscription subscription = org.mockito.Mockito.mock(PushSubscription.class);
        when(subscription.getId()).thenReturn(id);
        return subscription;
    }

    private PushEvent event() {
        return new PushEvent("climatic:centro:ALERT:1",
                PushCategory.CLIMATIC,
                new PushPayload("t", "b", "/", "climatic:centro:ALERT:1", PushCategory.CLIMATIC));
    }

    @Test
    void pagesSubscriptionsAndEmitsBatchesBoundedByBatchSize() {
        properties.setSubscriptionPageSize(2);
        properties.setSendBatchSize(2);

        Page<PushSubscription> page0 = new PageImpl<>(
                List.of(subscription(1L), subscription(2L)), PageRequest.of(0, 2), 5);
        Page<PushSubscription> page1 = new PageImpl<>(
                List.of(subscription(3L), subscription(4L)), PageRequest.of(1, 2), 5);
        Page<PushSubscription> page2 = new PageImpl<>(
                List.of(subscription(5L)), PageRequest.of(2, 2), 5);
        when(subscriptionService.pageByCategory(eq(PushCategory.CLIMATIC), any(Pageable.class)))
                .thenReturn(page0, page1, page2);

        listener.onEvent(event());

        ArgumentCaptor<PushSendBatch> captor = ArgumentCaptor.forClass(PushSendBatch.class);
        verify(rabbitTemplate, org.mockito.Mockito.times(3))
                .convertAndSend(eq("push.send.q"), captor.capture());

        List<Long> allIds = new ArrayList<>();
        captor.getAllValues().forEach(batch -> {
            assertThat(batch.subscriptionIds().size()).isLessThanOrEqualTo(2);
            assertThat(batch.dedupKey()).isEqualTo("climatic:centro:ALERT:1");
            allIds.addAll(batch.subscriptionIds());
        });
        assertThat(allIds).containsExactly(1L, 2L, 3L, 4L, 5L);
    }

    @Test
    void emitsNothingWhenNoSubscriptionsMatchTheCategory() {
        properties.setSubscriptionPageSize(500);
        properties.setSendBatchSize(100);
        when(subscriptionService.pageByCategory(eq(PushCategory.CLIMATIC), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 500), 0));

        listener.onEvent(event());

        verify(rabbitTemplate, org.mockito.Mockito.never()).convertAndSend(any(String.class), any(Object.class));
    }
}
