package com.scamshield.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.scamshield.exception.InvalidImageException;
import com.scamshield.model.UploadedImage;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class ImageValidationUtilTest {

    private final ImageValidationUtil imageValidationUtil = new ImageValidationUtil();

    @Test
    void acceptsValidJpegImage() {
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "message.jpg",
                "image/jpeg",
                new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}
        );

        UploadedImage uploadedImage = imageValidationUtil.validateAndRead(file);

        assertThat(uploadedImage.getContentType()).isEqualTo("image/jpeg");
        assertThat(uploadedImage.sizeInBytes()).isEqualTo(4);
    }

    @Test
    void rejectsUnsupportedImageTypes() {
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "message.pdf",
                "application/pdf",
                new byte[]{0x25, 0x50, 0x44, 0x46}
        );

        assertThatThrownBy(() -> imageValidationUtil.validateAndRead(file))
                .isInstanceOf(InvalidImageException.class)
                .hasMessage("Only PNG, JPG, and JPEG images are supported");
    }
}
