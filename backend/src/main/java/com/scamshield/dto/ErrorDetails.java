package com.scamshield.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class ErrorDetails {

    private final String code;

    private final List<String> details;

    private ErrorDetails(String code, List<String> details) {
        this.code = code;
        this.details = details;
    }

    public static ErrorDetails of(String code, String detail) {
        return new ErrorDetails(code, List.of(detail));
    }

    public static ErrorDetails of(String code, List<String> details) {
        return new ErrorDetails(code, List.copyOf(details));
    }
}
