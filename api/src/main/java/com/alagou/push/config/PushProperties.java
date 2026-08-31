package com.alagou.push.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.push")
public class PushProperties {

    private boolean enabled = false;
    private Vapid vapid = new Vapid();
    private int sendBatchSize = 100;
    private int subscriptionPageSize = 500;
    private int dailyCap = 15;
    private int climaticCooldownMinutes = 60;
    private long outboxRelayMs = 5000;
    private int maxAttempts = 5;
    private int sendConcurrency = 8;
    private int outboxClaimSize = 50;

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public Vapid getVapid() { return vapid; }
    public void setVapid(Vapid vapid) { this.vapid = vapid; }
    public int getSendBatchSize() { return sendBatchSize; }
    public void setSendBatchSize(int sendBatchSize) { this.sendBatchSize = sendBatchSize; }
    public int getSubscriptionPageSize() { return subscriptionPageSize; }
    public void setSubscriptionPageSize(int subscriptionPageSize) { this.subscriptionPageSize = subscriptionPageSize; }
    public int getDailyCap() { return dailyCap; }
    public void setDailyCap(int dailyCap) { this.dailyCap = dailyCap; }
    public int getClimaticCooldownMinutes() { return climaticCooldownMinutes; }
    public void setClimaticCooldownMinutes(int climaticCooldownMinutes) { this.climaticCooldownMinutes = climaticCooldownMinutes; }
    public long getOutboxRelayMs() { return outboxRelayMs; }
    public void setOutboxRelayMs(long outboxRelayMs) { this.outboxRelayMs = outboxRelayMs; }
    public int getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(int maxAttempts) { this.maxAttempts = maxAttempts; }
    public int getSendConcurrency() { return sendConcurrency; }
    public void setSendConcurrency(int sendConcurrency) { this.sendConcurrency = sendConcurrency; }
    public int getOutboxClaimSize() { return outboxClaimSize; }
    public void setOutboxClaimSize(int outboxClaimSize) { this.outboxClaimSize = outboxClaimSize; }

    public static class Vapid {
        private String publicKey;
        private String privateKey;
        private String subject;

        public String getPublicKey() { return publicKey; }
        public void setPublicKey(String publicKey) { this.publicKey = publicKey; }
        public String getPrivateKey() { return privateKey; }
        public void setPrivateKey(String privateKey) { this.privateKey = privateKey; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
    }
}
