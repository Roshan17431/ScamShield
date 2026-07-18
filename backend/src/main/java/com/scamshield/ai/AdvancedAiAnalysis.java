package com.scamshield.ai;

import java.util.List;

public record AdvancedAiAnalysis(
        int riskScore,
        String riskLevel,
        String category,
        int confidence,
        String summary,
        String explanation,
        List<String> redFlags,
        String recommendedAction
) {
}
