package com.alagou.domain;

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
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    protected Usuario() {
    }

    public Usuario(String email, String name, String googleId, String pictureUrl) {
        this.email = email;
        this.name = name;
        this.googleId = googleId;
        this.pictureUrl = pictureUrl;
        this.createdAt = Instant.now();
    }

    public Usuario(String email, String name, String passwordHash) {
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.createdAt = Instant.now();
    }

    public void linkGoogleAccount(String googleId, String pictureUrl) {
        this.googleId = googleId;
        this.pictureUrl = pictureUrl;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getGoogleId() {
        return googleId;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Role getRole() {
        return role;
    }
}
