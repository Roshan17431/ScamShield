package com.scamshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ScamAnalysisRequestDTO(
        @NotBlank(message = "Text is required")
        @Size(max = 20_000, message = "Text must be 20,000 characters or fewer")
        String text
) {
}
