package com.alagou.dto;

import com.alagou.domain.Role;

public record AuthResponse(String token, Long userId, String email, String name, String pictureUrl, Role role) {
}
