package com.scamshield.exception;

import org.springframework.http.HttpStatus;

public class InvalidImageException extends ScamShieldException {

    public InvalidImageException(String message) {
        super(HttpStatus.BAD_REQUEST, "INVALID_IMAGE", message);
    }

    public InvalidImageException(String message, Throwable cause) {
        super(HttpStatus.BAD_REQUEST, "INVALID_IMAGE", message, cause);
    }
}
