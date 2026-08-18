package com.alagou.camera.dto;

public record CameraResponse(
        String id,
        String name,
        String streamUrl,
        double lat,
        double lng
) {}
