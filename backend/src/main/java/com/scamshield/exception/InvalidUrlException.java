package com.scamshield.exception;

import org.springframework.http.HttpStatus;

public class InvalidUrlException extends ScamShieldException {

    public InvalidUrlException(String message) {
        super(HttpStatus.BAD_REQUEST, "INVALID_URL", message);
    }
}
