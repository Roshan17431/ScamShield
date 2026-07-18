package com.scamshield.util;

public record RuleSignal(
        String reason,
        String indicator,
        String severity,
        int riskScore
) {
}
