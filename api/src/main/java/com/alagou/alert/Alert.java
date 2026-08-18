package com.alagou.alert;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;

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

    @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point location;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "alert_photo", joinColumns = @JoinColumn(name = "alert_id"))
    @Column(name = "photo_path")
    private List<String> photos = new ArrayList<>();

    @Column(nullable = false)
    private Instant expirationDate;

    @Column(nullable = false)
    private Instant creationDate;

    @Column(nullable = false)
    private boolean active = true;

    protected Alert() {}

    public Alert(AlertType type, String username, Point location, List<String> photos, Instant expirationDate, Instant creationDate) {
        this.type = type;
        this.username = username;
        this.location = location;
        this.photos = photos != null ? photos : new ArrayList<>();
        this.expirationDate = expirationDate;
        this.creationDate = creationDate;
    }

    public Long getId() { return id; }
    public AlertType getType() { return type; }
    public String getUsername() { return username; }
    public Point getLocation() { return location; }
    public List<String> getPhotos() { return photos; }
    public Instant getExpirationDate() { return expirationDate; }
    public Instant getCreationDate() { return creationDate; }
    public boolean isActive() { return active; }

    public void renewExpiration(Instant expirationDate) {
        this.expirationDate = expirationDate;
    }

    public void deactivate() {
        this.active = false;
    }
}
