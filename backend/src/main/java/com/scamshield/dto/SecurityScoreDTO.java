package com.scamshield.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SecurityScoreDTO {

    int score;

    String riskLevel;

    public static SecurityScoreDTO fromRiskScore(int riskScore) {
        int normalizedRiskScore = Math.min(100, Math.max(0, riskScore));
        int securityScore = 100 - normalizedRiskScore;

        return SecurityScoreDTO.builder()
                .score(securityScore)
                .riskLevel(riskLevelForScore(securityScore))
                .build();
    }

    private static String riskLevelForScore(int securityScore) {
        if (securityScore <= 20) {
            return "CRITICAL";
        }
        if (securityScore <= 40) {
            return "HIGH";
        }
        if (securityScore <= 60) {
            return "MEDIUM";
        }
        if (securityScore <= 80) {
            return "LOW";
        }
        return "SAFE";
    }
}
