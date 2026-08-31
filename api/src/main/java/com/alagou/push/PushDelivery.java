package com.alagou.push;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "push_delivery")
public class PushDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long subscriptionId;

    @Column(nullable = false)
    private String dedupKey;

    @Column(nullable = false)
    private Instant sentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushDeliveryStatus status;

    protected PushDelivery() {}

    public PushDelivery(Long subscriptionId, String dedupKey, Instant sentAt, PushDeliveryStatus status) {
        this.subscriptionId = subscriptionId;
        this.dedupKey = dedupKey;
        this.sentAt = sentAt;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getSubscriptionId() { return subscriptionId; }
    public String getDedupKey() { return dedupKey; }
    public Instant getSentAt() { return sentAt; }
    public PushDeliveryStatus getStatus() { return status; }
}
