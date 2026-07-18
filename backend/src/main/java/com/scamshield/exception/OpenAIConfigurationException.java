package com.scamshield.exception;

import org.springframework.http.HttpStatus;

public class OpenAIConfigurationException extends ScamShieldException {

    public OpenAIConfigurationException(String message) {
        super(HttpStatus.SERVICE_UNAVAILABLE, "OPENAI_CONFIGURATION_ERROR", message);
    }
}
