package com.scamshield.dto;

import com.scamshield.ai.ScamAnalysisContract;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProtectionRequestDTO(
        @NotBlank(message = "Message is required")
        @Size(max = 20_000, message = "Message must be 20,000 characters or fewer")
        String message,

        @NotBlank(message = "Risk level is required")
        String riskLevel,

        @NotBlank(message = "Category is required")
        String category,

        @NotNull(message = "Red flags are required")
        @Size(max = 20, message = "Red flags must contain 20 items or fewer")
        List<@NotBlank(message = "Red flags cannot be blank") @Size(max = 500, message = "Each red flag must be 500 characters or fewer") String> redFlags
) {

    @AssertTrue(message = "Risk level is invalid")
    public boolean hasSupportedRiskLevel() {
        return riskLevel != null && ScamAnalysisContract.RISK_LEVELS.contains(riskLevel);
    }

    @AssertTrue(message = "Category is invalid")
    public boolean hasSupportedCategory() {
        return category != null && ScamAnalysisContract.CATEGORIES.contains(category);
    }
}
