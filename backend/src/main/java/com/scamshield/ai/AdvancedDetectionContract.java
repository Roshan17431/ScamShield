package com.scamshield.ai;

import java.util.List;

public final class AdvancedDetectionContract {

    public static final List<String> RISK_LEVELS = List.of("SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL");

    public static final List<String> URL_CATEGORIES = List.of(
            "Safe URL",
            "Phishing URL",
            "Suspicious URL",
            "Malicious Redirect",
            "Unknown"
    );

    public static final List<String> EMAIL_CATEGORIES = List.of(
            "Email Phishing",
            "Business Email Compromise",
            "Malicious Attachment",
            "Legitimate Email",
            "Unknown"
    );

    public static final List<String> JOB_CATEGORIES = List.of(
            "Job Scam",
            "Recruitment Phishing",
            "Work-from-home Scam",
            "Legitimate Job Offer",
            "Unknown"
    );

    private AdvancedDetectionContract() {
    }
}
