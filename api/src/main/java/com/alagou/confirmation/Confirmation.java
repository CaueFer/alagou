package com.alagou.confirmation;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "confirmation")
public class Confirmation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long alertId;

    @Column(nullable = false)
    private String username;

    @Column(name = "source_ip")
    private String sourceIp;

    @Column(nullable = false)
    private Instant createdAt;

    protected Confirmation() {}

    public Confirmation(Long alertId, String username, String sourceIp, Instant createdAt) {
        this.alertId = alertId;
        this.username = username;
        this.sourceIp = sourceIp;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getAlertId() { return alertId; }
    public String getUsername() { return username; }
    public String getSourceIp() { return sourceIp; }
    public Instant getCreatedAt() { return createdAt; }
}
