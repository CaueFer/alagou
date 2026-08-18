package com.alagou.camera;

import com.alagou.camera.dto.CameraResponse;
import com.alagou.camera.service.CameraService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CameraServiceTest {

    @Test
    void loadsAllCamerasFromJson() {
        CameraService service = new CameraService(new ObjectMapper());

        List<CameraResponse> cameras = service.listAll();

        assertThat(cameras).hasSize(11);
        assertThat(cameras).allSatisfy(camera -> {
            assertThat(camera.id()).isNotBlank();
            assertThat(camera.name()).isNotBlank();
            assertThat(camera.streamUrl()).startsWith("https://").endsWith(".m3u8");
        });
        assertThat(cameras).extracting(CameraResponse::id).doesNotHaveDuplicates();
    }
}
