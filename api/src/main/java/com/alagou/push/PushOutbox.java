package com.alagou.push;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "push_outbox")
public class PushOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushEventType eventType;

    @Column(nullable = false)
    private String routingKey;

    @Column(nullable = false)
    private String dedupKey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushOutboxStatus status = PushOutboxStatus.PENDING;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant sentAt;

    protected PushOutbox() {}

    public PushOutbox(PushEventType eventType, String routingKey, String dedupKey, String payload, Instant createdAt) {
        this.eventType = eventType;
        this.routingKey = routingKey;
        this.dedupKey = dedupKey;
        this.payload = payload;
        this.createdAt = createdAt;
    }

    public void markSent(Instant sentAt) {
        this.status = PushOutboxStatus.SENT;
        this.sentAt = sentAt;
    }

    public void registerAttempt() {
        this.attempts++;
    }

    public void markFailed() {
        this.status = PushOutboxStatus.FAILED;
    }

    public Long getId() { return id; }
    public PushEventType getEventType() { return eventType; }
    public String getRoutingKey() { return routingKey; }
    public String getDedupKey() { return dedupKey; }
    public String getPayload() { return payload; }
    public PushOutboxStatus getStatus() { return status; }
    public int getAttempts() { return attempts; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getSentAt() { return sentAt; }
}
