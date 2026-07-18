package com.scamshield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailAnalysisRequestDTO(
        @NotBlank(message = "Sender is required")
        @Size(max = 320, message = "Sender must be 320 characters or fewer")
        String sender,

        @NotBlank(message = "Subject is required")
        @Size(max = 500, message = "Subject must be 500 characters or fewer")
        String subject,

        @NotBlank(message = "Email body is required")
        @Size(max = 20_000, message = "Email body must be 20,000 characters or fewer")
        String body
) {
}
