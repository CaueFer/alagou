package com.alagou.camera.service;

import com.alagou.camera.dto.CameraResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class CameraService {

    private final List<CameraResponse> cameras;

    public CameraService(ObjectMapper objectMapper) {
        try (InputStream input = new ClassPathResource("cameras.json").getInputStream()) {
            this.cameras = objectMapper.readValue(input, new TypeReference<>() {});
        } catch (IOException e) {
            throw new IllegalStateException("Falha ao carregar cameras.json", e);
        }
    }

    public List<CameraResponse> listAll() {
        return cameras;
    }
}
