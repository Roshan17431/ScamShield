package com.scamshield.util;

import java.util.List;

public record UrlRuleAssessment(
        String normalizedUrl,
        List<RuleSignal> signals,
        int riskScore
) {

    public UrlRuleAssessment {
        signals = List.copyOf(signals);
    }
}
