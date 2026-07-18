package com.scamshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UrlAnalysisRequestDTO(
        @NotBlank(message = "URL is required")
        @Size(max = 10_000, message = "URL input must be 10,000 characters or fewer")
        String url
) {
}
