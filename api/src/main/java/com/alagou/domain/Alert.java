package com.alagou.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alert")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType type;

    @Column(nullable = false)
    private String username;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "alert_photo", joinColumns = @JoinColumn(name = "alert_id"))
    @Column(name = "photo_path")
    private List<String> photos = new ArrayList<>();

    @Column(nullable = false)
    private Instant expirationDate;

    @Column(nullable = false)
    private Instant creationDate;

    protected Alert() {}

    public Alert(AlertType type, String username, List<String> photos, Instant expirationDate, Instant creationDate) {
        this.type = type;
        this.username = username;
        this.photos = photos != null ? photos : new ArrayList<>();
        this.expirationDate = expirationDate;
        this.creationDate = creationDate;
    }

    public Long getId() { return id; }
    public AlertType getType() { return type; }
    public String getUsername() { return username; }
    public List<String> getPhotos() { return photos; }
    public Instant getExpirationDate() { return expirationDate; }
    public Instant getCreationDate() { return creationDate; }
}
