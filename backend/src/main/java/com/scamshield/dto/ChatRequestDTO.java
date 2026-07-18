package com.scamshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequestDTO(
        @NotBlank(message = "Message is required")
        @Size(max = 4_000, message = "Message must be 4,000 characters or fewer")
        String message
) {
}
