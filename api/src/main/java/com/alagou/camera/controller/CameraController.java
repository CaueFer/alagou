package com.alagou.camera.controller;

import com.alagou.camera.dto.CameraResponse;
import com.alagou.camera.service.CameraService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cameras")
public class CameraController {

    private final CameraService cameraService;

    public CameraController(CameraService cameraService) {
        this.cameraService = cameraService;
    }

    @GetMapping
    public List<CameraResponse> listAll() {
        return cameraService.listAll();
    }
}
