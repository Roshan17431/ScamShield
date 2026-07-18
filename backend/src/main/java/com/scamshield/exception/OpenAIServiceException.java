package com.scamshield.exception;

import org.springframework.http.HttpStatus;

public class OpenAIServiceException extends ScamShieldException {

    public OpenAIServiceException(HttpStatus status, String code, String message) {
        super(status, code, message);
    }

    public OpenAIServiceException(HttpStatus status, String code, String message, Throwable cause) {
        super(status, code, message, cause);
    }
}
