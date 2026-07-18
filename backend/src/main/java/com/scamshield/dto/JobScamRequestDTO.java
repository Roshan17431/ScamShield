package com.scamshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobScamRequestDTO(
        @NotBlank(message = "Job offer message is required")
        @Size(max = 20_000, message = "Job offer message must be 20,000 characters or fewer")
        String message
) {
}
