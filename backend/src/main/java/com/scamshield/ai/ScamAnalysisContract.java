package com.scamshield.ai;

import java.util.List;

public final class ScamAnalysisContract {

    public static final List<String> RISK_LEVELS = List.of("LOW", "MEDIUM", "HIGH", "CRITICAL");

    public static final List<String> CATEGORIES = List.of(
            "Banking Phishing",
            "UPI Scam",
            "Lottery Scam",
            "Job Scam",
            "Courier Scam",
            "Investment Scam",
            "OTP Scam",
            "Fake Customer Support",
            "Social Media Scam",
            "Shopping Scam",
            "Unknown"
    );

    private ScamAnalysisContract() {
    }
}
