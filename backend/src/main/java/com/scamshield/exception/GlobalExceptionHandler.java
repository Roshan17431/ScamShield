package com.scamshield.exception;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.ErrorDetails;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.multipart.MultipartException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ScamShieldException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleScamShieldException(ScamShieldException exception) {
        log.warn("Handled API exception [{}]: {}", exception.getCode(), exception.getMessage());
        return buildResponse(
                exception.getStatus(),
                exception.getMessage(),
                exception.getCode(),
                List.of(exception.getMessage())
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException exception) {
        log.warn("Rejected oversized upload: {}", exception.getMessage());
        String message = "Image must be 10 MB or smaller";
        return buildResponse(HttpStatus.PAYLOAD_TOO_LARGE, message, "FILE_TOO_LARGE", List.of(message));
    }

    @ExceptionHandler({
            MissingServletRequestPartException.class,
            MultipartException.class,
            HttpMediaTypeNotSupportedException.class
    })
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMultipartException(Exception exception) {
        log.warn("Rejected multipart request: {}", exception.getMessage());
        String message = "Upload a PNG, JPG, or JPEG image using the image form field";
        return buildResponse(HttpStatus.BAD_REQUEST, message, "INVALID_MULTIPART_REQUEST", List.of(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        List<String> details = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .toList();
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", "VALIDATION_FAILED", details);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleConstraintViolation(ConstraintViolationException exception) {
        List<String> details = exception.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .toList();
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", "VALIDATION_FAILED", details);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUnexpectedException(Exception exception) {
        log.error("Unexpected API exception", exception);
        String message = "Something went wrong while processing the request";
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, "INTERNAL_SERVER_ERROR", List.of(message));
    }

    private ResponseEntity<ApiResponse<ErrorDetails>> buildResponse(
            HttpStatus status,
            String message,
            String code,
            List<String> details
    ) {
        return ResponseEntity.status(status)
                .body(ApiResponse.failure(message, ErrorDetails.of(code, details)));
    }

    private String formatFieldError(FieldError fieldError) {
        return fieldError.getField() + ": " + fieldError.getDefaultMessage();
    }
}
