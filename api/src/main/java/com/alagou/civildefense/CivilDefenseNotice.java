package com.alagou.civildefense;

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
@Table(name = "civil_defense_notice")
public class CivilDefenseNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", nullable = false)
    private long externalId;

    @Column(nullable = false)
    private String title;

    @Column
    private String excerpt;

    @Column
    private String content;

    @Column
    private String link;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private CivilDefenseRiskLevel riskLevel;

    @Column(name = "published_at", nullable = false)
    private Instant publishedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected CivilDefenseNotice() {}

    public CivilDefenseNotice(long externalId, String title, String excerpt, String content, String link,
                               CivilDefenseRiskLevel riskLevel, Instant publishedAt, Instant createdAt) {
        this.externalId = externalId;
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.link = link;
        this.riskLevel = riskLevel;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public long getExternalId() { return externalId; }
    public String getTitle() { return title; }
    public String getExcerpt() { return excerpt; }
    public String getContent() { return content; }
    public String getLink() { return link; }
    public CivilDefenseRiskLevel getRiskLevel() { return riskLevel; }
    public Instant getPublishedAt() { return publishedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
