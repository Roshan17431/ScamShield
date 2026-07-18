package com.scamshield.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UploadedImage {

    private final String fileName;

    private final String contentType;

    private final byte[] bytes;

    public long sizeInBytes() {
        return bytes.length;
    }
}
