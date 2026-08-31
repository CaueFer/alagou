package com.alagou.push.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@ConditionalOnProperty(name = "app.push.enabled", havingValue = "true")
public class PushRabbitConfig {

    public static final String EVENTS_EXCHANGE = "push.events";
    public static final String DLX = "push.events.dlx";
    public static final String DLQ = "push.events.dlq";
    public static final String FANOUT_QUEUE = "push.fanout.q";
    public static final String SEND_QUEUE = "push.send.q";
    public static final String SEND_ROUTING_KEY = "push.send";
    public static final String EVENT_ROUTING_PATTERN = "push.#";
    public static final String SEND_LISTENER_FACTORY = "pushSendListenerContainerFactory";

    private static final String DEAD_LETTER_EXCHANGE_ARG = "x-dead-letter-exchange";

    @Bean
    public TopicExchange pushEventsExchange() {
        return new TopicExchange(EVENTS_EXCHANGE, true, false);
    }

    @Bean
    public FanoutExchange pushEventsDeadLetterExchange() {
        return new FanoutExchange(DLX, true, false);
    }

    @Bean
    public Queue pushEventsDeadLetterQueue() {
        return QueueBuilder.durable(DLQ).build();
    }

    @Bean
    public Queue pushFanoutQueue() {
        return QueueBuilder.durable(FANOUT_QUEUE)
                .withArgument(DEAD_LETTER_EXCHANGE_ARG, DLX)
                .build();
    }

    @Bean
    public Queue pushSendQueue() {
        return QueueBuilder.durable(SEND_QUEUE)
                .withArgument(DEAD_LETTER_EXCHANGE_ARG, DLX)
                .build();
    }

    @Bean
    public Binding pushFanoutBinding() {
        return BindingBuilder.bind(pushFanoutQueue()).to(pushEventsExchange()).with(EVENT_ROUTING_PATTERN);
    }

    @Bean
    public Binding pushSendBinding() {
        return BindingBuilder.bind(pushSendQueue()).to(pushEventsExchange()).with(SEND_ROUTING_KEY);
    }

    @Bean
    public Binding pushDeadLetterBinding() {
        return BindingBuilder.bind(pushEventsDeadLetterQueue()).to(pushEventsDeadLetterExchange());
    }

    @Bean
    public Jackson2JsonMessageConverter pushMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean(SEND_LISTENER_FACTORY)
    public SimpleRabbitListenerContainerFactory pushSendListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter pushMessageConverter,
            PushProperties properties) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(pushMessageConverter);
        int concurrency = Math.max(1, properties.getSendConcurrency());
        factory.setConcurrentConsumers(concurrency);
        factory.setMaxConcurrentConsumers(concurrency);
        factory.setDefaultRequeueRejected(false);
        factory.setAdviceChain(RetryInterceptorBuilder.stateless()
                .maxAttempts(Math.max(1, properties.getMaxAttempts()))
                .backOffOptions(1000, 2.0, 10000)
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build());
        return factory;
    }
}
