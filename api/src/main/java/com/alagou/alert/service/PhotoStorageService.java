package com.alagou.alert.service;

import com.alagou.exception.BusinessRuleException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class PhotoStorageService {

    private static final Set<String> ACCEPTED_FORMATS = Set.of("jpeg", "jpg", "png", "webp");

    private final Path uploadPath;

    public PhotoStorageService(@Value("${app.upload.dir}") String uploadDir) throws IOException {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
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
        DecodedImage decoded = decode(file);

        // Re-encoding through ImageIO drops EXIF/GPS metadata and neutralises any polyglot payload.
        boolean hasAlpha = decoded.image().getColorModel().hasAlpha();
        String outputFormat = hasAlpha ? "png" : "jpeg";
        String extension = hasAlpha ? "png" : "jpg";
        String name = UUID.randomUUID() + "." + extension;

        Path target = uploadPath.resolve(name).normalize();
        if (!target.startsWith(uploadPath)) {
            throw new BusinessRuleException("Caminho de arquivo inválido");
        }

        try {
            BufferedImage toWrite = decoded.image();
            if (!hasAlpha && toWrite.getType() != BufferedImage.TYPE_INT_RGB) {
                BufferedImage rgb = new BufferedImage(toWrite.getWidth(), toWrite.getHeight(), BufferedImage.TYPE_INT_RGB);
                Graphics2D graphics = rgb.createGraphics();
                graphics.drawImage(toWrite, 0, 0, Color.WHITE, null);
                graphics.dispose();
                toWrite = rgb;
            }
            if (!ImageIO.write(toWrite, outputFormat, target.toFile())) {
                throw new BusinessRuleException("Arquivo de imagem inválido");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store photo: " + name, e);
        }
        return name;
    }

    private DecodedImage decode(MultipartFile file) {
        try (InputStream in = file.getInputStream();
             ImageInputStream stream = ImageIO.createImageInputStream(in)) {
            if (stream == null) {
                throw new BusinessRuleException("Arquivo de imagem inválido");
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(stream);
            if (!readers.hasNext()) {
                throw new BusinessRuleException("Arquivo de imagem inválido");
            }
            ImageReader reader = readers.next();
            String format = reader.getFormatName().toLowerCase();
            if (!ACCEPTED_FORMATS.contains(format)) {
                throw new BusinessRuleException("Formato de imagem não suportado");
            }
            try {
                reader.setInput(stream);
                BufferedImage image = reader.read(0);
                if (image == null) {
                    throw new BusinessRuleException("Arquivo de imagem inválido");
                }
                return new DecodedImage(image);
            } finally {
                reader.dispose();
            }
        } catch (IOException e) {
            throw new BusinessRuleException("Arquivo de imagem inválido");
        }
    }

    private record DecodedImage(BufferedImage image) {
    }
}
