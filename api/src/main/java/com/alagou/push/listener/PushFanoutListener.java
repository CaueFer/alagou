package com.alagou.push.listener;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.alagou.push.PushSubscription;
import com.alagou.push.config.PushProperties;
import com.alagou.push.config.PushRabbitConfig;
import com.alagou.push.dto.PushEvent;
import com.alagou.push.dto.PushSendBatch;
import com.alagou.push.service.PushSubscriptionService;

@Component
@ConditionalOnProperty(name = "app.push.enabled", havingValue = "true")
public class PushFanoutListener {

    private static final Logger log = LoggerFactory.getLogger(PushFanoutListener.class);

    private final PushSubscriptionService subscriptionService;
    private final RabbitTemplate rabbitTemplate;
    private final PushProperties properties;

    public PushFanoutListener(PushSubscriptionService subscriptionService,
                              RabbitTemplate rabbitTemplate,
                              PushProperties properties) {
        this.subscriptionService = subscriptionService;
        this.rabbitTemplate = rabbitTemplate;
        this.properties = properties;
    }

    @RabbitListener(queues = PushRabbitConfig.FANOUT_QUEUE)
    public void onEvent(PushEvent event) {
        int pageSize = Math.max(1, properties.getSubscriptionPageSize());
        int batchSize = Math.max(1, properties.getSendBatchSize());
        int emittedBatches = 0;
        int pageNumber = 0;
        Page<PushSubscription> page;
        do {
            page = subscriptionService.pageByCategory(
                    event.category(),
                    PageRequest.of(pageNumber, pageSize, Sort.by("id")));
            List<Long> ids = page.map(PushSubscription::getId).getContent();
            for (int start = 0; start < ids.size(); start += batchSize) {
                List<Long> chunk = List.copyOf(ids.subList(start, Math.min(start + batchSize, ids.size())));
                // Routed straight to the send queue via the default exchange: the send queue also
                // matches the "push.#" binding of the fanout queue, so publishing batches through
                // "push.events" would loop them back into this listener.
                rabbitTemplate.convertAndSend(
                        PushRabbitConfig.SEND_QUEUE,
                        new PushSendBatch(event.dedupKey(), chunk, event.payload()));
                emittedBatches++;
            }
            pageNumber++;
        } while (page.hasNext());

        log.debug("Fanout for {} emitted {} send batches", event.dedupKey(), emittedBatches);
    }
}
