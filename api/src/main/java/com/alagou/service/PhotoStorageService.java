package com.alagou.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoStorageService {

    private final Path uploadPath;

    public PhotoStorageService(@Value("${app.upload.dir}") String uploadDir) throws IOException {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath();
        Files.createDirectories(uploadPath);
    }

    public List<String> store(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return List.of();
        return files.stream()
                .filter(f -> f != null && !f.isEmpty())
                .map(this::storeOne)
                .toList();
    }

    private String storeOne(MultipartFile file) {
        String filename = UUID.randomUUID() + extension(file.getOriginalFilename());
        try {
            Files.copy(file.getInputStream(), uploadPath.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store photo: " + filename, e);
        }
        return filename;
    }

    private String extension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
