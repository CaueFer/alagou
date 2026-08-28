package com.alagou.zone;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "zone_snapshot")
public class ZoneSnapshot {

    @Id
    @Column(name = "zone_id", nullable = false)
    private String zoneId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", columnDefinition = "jsonb", nullable = false)
    private String payload;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ZoneSnapshot() {}

    public ZoneSnapshot(String zoneId, String payload, Instant updatedAt) {
        this.zoneId = zoneId;
        this.payload = payload;
        this.updatedAt = updatedAt;
    }

    public String getZoneId() { return zoneId; }
    public String getPayload() { return payload; }
    public Instant getUpdatedAt() { return updatedAt; }
}