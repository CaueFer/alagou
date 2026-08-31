package com.alagou.push;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "push_subscription")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private String p256dh;

    @Column(nullable = false)
    private String auth;

    @Column(nullable = false)
    private boolean nearbyEnabled = true;

    @Column(nullable = false)
    private boolean climaticEnabled = true;

    @Column(nullable = false)
    private boolean civilDefenseEnabled = true;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant lastSeenAt;

    @Column(nullable = false)
    private int failureCount = 0;

    @Column(nullable = false)
    private int dailySentCount = 0;

    private LocalDate dailyCountDate;

    protected PushSubscription() {}

    public PushSubscription(String endpoint, String p256dh, String auth,
                            boolean nearbyEnabled, boolean climaticEnabled, boolean civilDefenseEnabled,
                            Instant now) {
        this.endpoint = endpoint;
        this.p256dh = p256dh;
        this.auth = auth;
        this.nearbyEnabled = nearbyEnabled;
        this.climaticEnabled = climaticEnabled;
        this.civilDefenseEnabled = civilDefenseEnabled;
        this.createdAt = now;
        this.updatedAt = now;
        this.lastSeenAt = now;
    }

    public void updateKeys(String p256dh, String auth, Instant now) {
        this.p256dh = p256dh;
        this.auth = auth;
        this.updatedAt = now;
    }

    public void updateFlags(boolean nearbyEnabled, boolean climaticEnabled, boolean civilDefenseEnabled, Instant now) {
        this.nearbyEnabled = nearbyEnabled;
        this.climaticEnabled = climaticEnabled;
        this.civilDefenseEnabled = civilDefenseEnabled;
        this.updatedAt = now;
    }

    public void markSeen(Instant now) {
        this.lastSeenAt = now;
    }

    public boolean isDailyCapReached(LocalDate today, int dailyCap) {
        return today.equals(dailyCountDate) && dailySentCount >= dailyCap;
    }

    public void registerSent(LocalDate today) {
        if (!today.equals(dailyCountDate)) {
            dailyCountDate = today;
            dailySentCount = 0;
        }
        dailySentCount++;
    }

    public void registerFailure() {
        failureCount++;
    }

    public Long getId() { return id; }
    public String getEndpoint() { return endpoint; }
    public String getP256dh() { return p256dh; }
    public String getAuth() { return auth; }
    public boolean isNearbyEnabled() { return nearbyEnabled; }
    public boolean isClimaticEnabled() { return climaticEnabled; }
    public boolean isCivilDefenseEnabled() { return civilDefenseEnabled; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getLastSeenAt() { return lastSeenAt; }
    public int getFailureCount() { return failureCount; }
    public int getDailySentCount() { return dailySentCount; }
    public LocalDate getDailyCountDate() { return dailyCountDate; }
}
