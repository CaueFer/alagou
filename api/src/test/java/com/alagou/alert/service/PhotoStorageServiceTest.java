package com.alagou.alert.service;

import com.alagou.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhotoStorageServiceTest {

    @TempDir
    Path tempDir;

    private PhotoStorageService service() throws IOException {
        return new PhotoStorageService(tempDir.toString());
    }

    @Test
    void rejectsNonImagePayload() throws IOException {
        PhotoStorageService service = service();
        MockMultipartFile html = new MockMultipartFile("photos", "evil.html", "image/png",
                "<html><body><script>alert(1)</script></body></html>".getBytes());

        assertThatThrownBy(() -> service.store(List.of(html)))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void rejectsSvgPayload() throws IOException {
        PhotoStorageService service = service();
        MockMultipartFile svg = new MockMultipartFile("photos", "logo.svg", "image/svg+xml",
                "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>1</script></svg>".getBytes());

        assertThatThrownBy(() -> service.store(List.of(svg)))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void ignoresClientSuppliedFilenameAndExtension() throws IOException {
        PhotoStorageService service = service();
        MockMultipartFile disguised = new MockMultipartFile("photos", "../../evil.html", "text/html", pngBytes());

        List<String> stored = service.store(List.of(disguised));

        assertThat(stored).hasSize(1);
        String name = stored.get(0);
        assertThat(name).doesNotContain("evil", "html", "..", "/");
        assertThat(name).matches("[0-9a-f-]{36}\\.(jpg|png)");
        assertThat(Files.exists(tempDir.resolve(name))).isTrue();
    }

    @Test
    void storesFileInsideUploadDirectoryOnly() throws IOException {
        PhotoStorageService service = service();

        String name = service.store(List.of(new MockMultipartFile("photos", "a.jpg", "image/jpeg", jpegBytes()))).get(0);

        Path resolved = tempDir.resolve(name).normalize();
        assertThat(resolved.startsWith(tempDir)).isTrue();
        assertThat(resolved.getParent()).isEqualTo(tempDir);
    }

    @Test
    void reEncodedFileDropsExifMetadata() throws IOException {
        PhotoStorageService service = service();
        byte[] jpegWithExif = jpegWithPlantedExif();
        assertThat(indexOf(jpegWithExif, "Exif".getBytes())).isGreaterThan(-1);

        String name = service.store(List.of(new MockMultipartFile("photos", "gps.jpg", "image/jpeg", jpegWithExif))).get(0);

        byte[] servedBytes = Files.readAllBytes(tempDir.resolve(name));
        assertThat(indexOf(servedBytes, "Exif".getBytes())).isEqualTo(-1);
        assertThat(indexOf(servedBytes, "GPSInfo".getBytes())).isEqualTo(-1);
    }

    private static byte[] pngBytes() throws IOException {
        return encode("png");
    }

    private static byte[] jpegBytes() throws IOException {
        return encode("jpeg");
    }

    private static byte[] encode(String format) throws IOException {
        BufferedImage image = new BufferedImage(16, 16, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setColor(Color.BLUE);
        g.fillRect(0, 0, 16, 16);
        g.dispose();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(image, format, out);
        return out.toByteArray();
    }

    private static byte[] jpegWithPlantedExif() throws IOException {
        // Decoders stop at the EOI marker, so these trailing bytes ride along in the source but must
        // not reappear once the service has re-encoded the pixels into a fresh JPEG.
        byte[] clean = jpegBytes();
        byte[] trailer = "Exif  MM *GPSInfo fake-gps-35.6895,139.6917".getBytes();

        byte[] result = new byte[clean.length + trailer.length];
        System.arraycopy(clean, 0, result, 0, clean.length);
        System.arraycopy(trailer, 0, result, clean.length, trailer.length);
        return result;
    }

    private static int indexOf(byte[] haystack, byte[] needle) {
        outer:
        for (int i = 0; i <= haystack.length - needle.length; i++) {
            for (int j = 0; j < needle.length; j++) {
                if (haystack[i + j] != needle[j]) {
                    continue outer;
                }
            }
            return i;
        }
        return -1;
    }
}
