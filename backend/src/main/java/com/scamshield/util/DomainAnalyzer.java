package com.scamshield.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class DomainAnalyzer {

    private static final Pattern IPV4_PATTERN = Pattern.compile(
            "^(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}$"
    );

    private static final Set<String> SUSPICIOUS_TLDS = Set.of(
            "xyz", "top", "click", "gq", "tk", "ml", "cf", "work", "support", "live", "rest", "buzz"
    );

    private static final Set<String> PHISHING_KEYWORDS = Set.of(
            "login", "verify", "secure", "account", "update", "wallet", "payment", "reward", "signin"
    );

    private static final Map<String, Set<String>> TRUSTED_BRAND_DOMAINS = Map.of(
            "sbi", Set.of("sbi.co.in", "onlinesbi.sbi"),
            "hdfc", Set.of("hdfcbank.com"),
            "icici", Set.of("icicibank.com"),
            "paypal", Set.of("paypal.com"),
            "google", Set.of("google.com", "google.co.in"),
            "microsoft", Set.of("microsoft.com", "microsoftonline.com", "office.com", "live.com"),
            "amazon", Set.of("amazon.com", "amazon.in"),
            "whatsapp", Set.of("whatsapp.com"),
            "instagram", Set.of("instagram.com"),
            "facebook", Set.of("facebook.com", "fb.com")
    );

    public List<RuleSignal> analyze(String domain) {
        String normalizedDomain = normalizeDomain(domain);
        List<RuleSignal> signals = new ArrayList<>();

        if (normalizedDomain.startsWith("xn--") || normalizedDomain.contains(".xn--")) {
            signals.add(signal("Uses an internationalized domain that can mask look-alike characters", "Fake Domain", "HIGH", 24));
        }

        String topLevelDomain = topLevelDomain(normalizedDomain);
        if (SUSPICIOUS_TLDS.contains(topLevelDomain)) {
            signals.add(signal("Uses a high-risk top-level domain", "Fake Domain", "HIGH", 20));
        }

        if (hasLookAlikeBrand(normalizedDomain)) {
            signals.add(signal("Potentially impersonates a known brand", "Fake Domain", "CRITICAL", 28));
        }

        if (containsPhishingKeyword(normalizedDomain) && !isTrustedBrandDomain(normalizedDomain)) {
            signals.add(signal("Domain contains phishing-style keywords", "Fake Domain", "MEDIUM", 14));
        }

        long hyphenCount = normalizedDomain.chars().filter(character -> character == '-').count();
        if (hyphenCount >= 2 || normalizedDomain.split("\\.").length >= 5) {
            signals.add(signal("Domain structure is unusually complex", "Fake Domain", "LOW", 8));
        }

        return List.copyOf(signals);
    }

    public boolean isIpAddress(String domain) {
        String normalizedDomain = normalizeDomain(domain);
        return IPV4_PATTERN.matcher(normalizedDomain).matches() || normalizedDomain.contains(":");
    }

    private boolean hasLookAlikeBrand(String domain) {
        return TRUSTED_BRAND_DOMAINS.keySet().stream()
                .anyMatch(brand -> domain.contains(brand) && !isTrustedBrandDomain(domain));
    }

    private boolean isTrustedBrandDomain(String domain) {
        return TRUSTED_BRAND_DOMAINS.values().stream()
                .flatMap(Set::stream)
                .anyMatch(trustedDomain -> domain.equals(trustedDomain) || domain.endsWith("." + trustedDomain));
    }

    private boolean containsPhishingKeyword(String domain) {
        return PHISHING_KEYWORDS.stream().anyMatch(domain::contains);
    }

    private String topLevelDomain(String domain) {
        int lastDotIndex = domain.lastIndexOf('.');
        return lastDotIndex >= 0 && lastDotIndex < domain.length() - 1
                ? domain.substring(lastDotIndex + 1)
                : "";
    }

    private String normalizeDomain(String domain) {
        return domain.replace("[", "").replace("]", "").toLowerCase(Locale.ROOT).trim();
    }

    private RuleSignal signal(String reason, String indicator, String severity, int riskScore) {
        return new RuleSignal(reason, indicator, severity, riskScore);
    }
}
