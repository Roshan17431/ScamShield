package com.scamshield.util;

import com.scamshield.exception.InvalidImageException;
import com.scamshield.model.UploadedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageValidationUtil {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024L * 1024L;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/png", "image/jpeg");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg");

    public UploadedImage validateAndRead(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidImageException("Image file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new InvalidImageException("Image must be 10 MB or smaller");
        }

        String extension = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidImageException("Only PNG, JPG, and JPEG images are supported");
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new InvalidImageException("Only PNG, JPG, and JPEG images are supported");
        }

        byte[] bytes = readBytes(file);
        if (!hasSupportedSignature(bytes)) {
            throw new InvalidImageException("Uploaded file does not look like a valid PNG or JPEG image");
        }

        return UploadedImage.builder()
                .fileName(file.getOriginalFilename())
                .contentType(contentType.toLowerCase(Locale.ROOT))
                .bytes(bytes)
                .build();
    }

    private String getExtension(String filename) {
        if (!StringUtils.hasText(filename) || !filename.contains(".")) {
            return "";
        }

        String extension = filename.substring(filename.lastIndexOf('.') + 1);
        return extension.toLowerCase(Locale.ROOT);
    }

    private byte[] readBytes(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            return inputStream.readAllBytes();
        } catch (IOException exception) {
            throw new InvalidImageException("Unable to read uploaded image", exception);
        }
    }

    private boolean hasSupportedSignature(byte[] bytes) {
        return isPng(bytes) || isJpeg(bytes);
    }

    private boolean isPng(byte[] bytes) {
        return bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4E
                && bytes[3] == 0x47
                && bytes[4] == 0x0D
                && bytes[5] == 0x0A
                && bytes[6] == 0x1A
                && bytes[7] == 0x0A;
    }

    private boolean isJpeg(byte[] bytes) {
        return bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF;
    }
}
