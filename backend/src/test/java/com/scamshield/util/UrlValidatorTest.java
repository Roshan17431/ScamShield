package com.scamshield.util;

import static org.assertj.core.api.Assertions.assertThat;

import com.scamshield.dto.SecurityScoreDTO;
import org.junit.jupiter.api.Test;

class UrlValidatorTest {

    private final UrlValidator urlValidator = new UrlValidator(new DomainAnalyzer());

    @Test
    void detectsHighRiskUrlPatterns() {
        UrlRuleAssessment assessment = urlValidator.analyze(
                "http://sbi-secure-login.xyz/verify?redirect=https%3A%2F%2Fexample.com"
        );

        assertThat(assessment.riskScore()).isGreaterThanOrEqualTo(70);
        assertThat(assessment.signals())
                .extracting(RuleSignal::indicator)
                .contains("HTTP", "Fake Domain", "Redirect Pattern");
    }

    @Test
    void extractsMultipleUrlsFromText() {
        assertThat(urlValidator.extractUrls("Review http://first.test and https://second.xyz/path."))
                .containsExactly("http://first.test", "https://second.xyz/path");
    }

    @Test
    void mapsSecurityScoreToRequiredBands() {
        assertThat(SecurityScoreDTO.fromRiskScore(80).getRiskLevel()).isEqualTo("CRITICAL");
        assertThat(SecurityScoreDTO.fromRiskScore(59).getRiskLevel()).isEqualTo("MEDIUM");
        assertThat(SecurityScoreDTO.fromRiskScore(39).getRiskLevel()).isEqualTo("LOW");
        assertThat(SecurityScoreDTO.fromRiskScore(19).getRiskLevel()).isEqualTo("SAFE");
    }
}
