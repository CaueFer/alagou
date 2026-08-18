package com.alagou.dto;

public record AuthResponse(String token, Long userId, String email, String name, String pictureUrl) {
}
