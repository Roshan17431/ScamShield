package com.scamshield.service.impl;

import com.scamshield.ai.AdvancedAiAnalysis;
import com.scamshield.ai.OpenAIService;
import com.scamshield.dto.EmailAnalysisRequestDTO;
import com.scamshield.dto.EmailAnalysisResponseDTO;
import com.scamshield.dto.JobScamRequestDTO;
import com.scamshield.dto.JobScamResponseDTO;
import com.scamshield.dto.SecurityScoreDTO;
import com.scamshield.dto.ThreatIndicatorDTO;
import com.scamshield.dto.UrlAnalysisRequestDTO;
import com.scamshield.dto.UrlAnalysisResponseDTO;
import com.scamshield.service.AdvancedDetectionService;
import com.scamshield.util.DomainAnalyzer;
import com.scamshield.util.RuleSignal;
import com.scamshield.util.UrlRuleAssessment;
import com.scamshield.util.UrlValidator;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdvancedDetectionServiceImpl implements AdvancedDetectionService {

    private static final Pattern EMAIL_ADDRESS_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private static final Pattern URGENCY_PATTERN = Pattern.compile(
            "(?i)\\b(urgent|immediately|act now|within \\d+ hours?|suspended|blocked|last chance)\\b"
    );

    private static final Pattern OTP_PATTERN = Pattern.compile(
            "(?i)\\b(otp|one[- ]time password|verification code|cvv|pin)\\b"
    );

    private static final Pattern PAYMENT_PATTERN = Pattern.compile(
            "(?i)\\b(registration|processing|application|training|joining|security)\\s*(fee|charge|amount)\\b|\\b(pay|deposit|transfer)\\b.{0,36}\\b(fee|charge|amount)\\b"
    );

    private static final Pattern UNREALISTIC_EARNINGS_PATTERN = Pattern.compile(
            "(?is)(?:earn|salary|income|pay).{0,60}(?:₹|rs\\.?|inr|\\d{2,})|(?:₹|rs\\.?|inr)\\s*\\d{2,}.{0,60}(?:month|monthly|day|daily)"
    );

    private static final Pattern TOO_GOOD_TO_BE_TRUE_PATTERN = Pattern.compile(
            "(?i)\\b(only \\d+ hours?|work from home|no experience|guaranteed (income|job)|instant (hiring|joining))\\b"
    );

    private final OpenAIService openAIService;

    private final UrlValidator urlValidator;

    private final DomainAnalyzer domainAnalyzer;

    @Override
    public UrlAnalysisResponseDTO analyzeUrl(UrlAnalysisRequestDTO request) {
        List<UrlRuleAssessment> assessments = urlValidator.analyzeInput(request.url());
        List<RuleSignal> ruleSignals = assessments.stream()
                .flatMap(assessment -> assessment.signals().stream())
                .toList();
        List<String> urls = assessments.stream().map(UrlRuleAssessment::normalizedUrl).toList();
        List<String> ruleFindings = reasonsFromSignals(ruleSignals);
        AdvancedAiAnalysis aiAnalysis = openAIService.analyzeUrls(urls, ruleFindings);
        SecurityScoreDTO securityScore = calculateSecurityScore(
                assessments.stream().mapToInt(UrlRuleAssessment::riskScore).max().orElse(0),
                aiAnalysis.riskScore()
        );
        List<String> reasons = mergeText(ruleFindings, aiAnalysis.redFlags());

        log.info(
                "Advanced URL analysis completed: urls={}, securityScore={}, riskLevel={}",
                urls.size(),
                securityScore.getScore(),
                securityScore.getRiskLevel()
        );

        return UrlAnalysisResponseDTO.builder()
                .analyzedUrls(urls)
                .safe("SAFE".equals(securityScore.getRiskLevel()))
                .securityScore(securityScore.getScore())
                .riskLevel(securityScore.getRiskLevel())
                .category(aiAnalysis.category())
                .confidence(aiAnalysis.confidence())
                .summary(aiAnalysis.summary())
                .explanation(aiAnalysis.explanation())
                .reasons(reasons)
                .recommendation(aiAnalysis.recommendedAction())
                .threatIndicators(buildThreatIndicators(ruleSignals, aiAnalysis.redFlags()))
                .build();
    }

    @Override
    public EmailAnalysisResponseDTO analyzeEmail(EmailAnalysisRequestDTO request) {
        List<RuleSignal> ruleSignals = collectEmailRuleSignals(request);
        List<String> ruleFindings = reasonsFromSignals(ruleSignals);
        AdvancedAiAnalysis aiAnalysis = openAIService.analyzeEmail(request, ruleFindings);
        SecurityScoreDTO securityScore = calculateSecurityScore(ruleRiskScore(ruleSignals), aiAnalysis.riskScore());
        List<String> redFlags = mergeText(ruleFindings, aiAnalysis.redFlags());

        log.info(
                "Advanced email analysis completed: senderLength={}, securityScore={}, riskLevel={}",
                request.sender().length(),
                securityScore.getScore(),
                securityScore.getRiskLevel()
        );

        return EmailAnalysisResponseDTO.builder()
                .securityScore(securityScore.getScore())
                .riskLevel(securityScore.getRiskLevel())
                .category(aiAnalysis.category())
                .confidence(aiAnalysis.confidence())
                .summary(aiAnalysis.summary())
                .explanation(aiAnalysis.explanation())
                .redFlags(redFlags)
                .recommendation(aiAnalysis.recommendedAction())
                .threatIndicators(buildThreatIndicators(ruleSignals, aiAnalysis.redFlags()))
                .build();
    }

    @Override
    public JobScamResponseDTO analyzeJobOffer(JobScamRequestDTO request) {
        List<RuleSignal> ruleSignals = collectJobRuleSignals(request.message());
        List<String> ruleFindings = reasonsFromSignals(ruleSignals);
        AdvancedAiAnalysis aiAnalysis = openAIService.analyzeJobOffer(request, ruleFindings);
        SecurityScoreDTO securityScore = calculateSecurityScore(ruleRiskScore(ruleSignals), aiAnalysis.riskScore());
        List<String> redFlags = mergeText(ruleFindings, aiAnalysis.redFlags());

        log.info(
                "Advanced job analysis completed: characters={}, securityScore={}, riskLevel={}",
                request.message().length(),
                securityScore.getScore(),
                securityScore.getRiskLevel()
        );

        return JobScamResponseDTO.builder()
                .securityScore(securityScore.getScore())
                .riskLevel(securityScore.getRiskLevel())
                .category(aiAnalysis.category())
                .confidence(aiAnalysis.confidence())
                .summary(aiAnalysis.summary())
                .explanation(aiAnalysis.explanation())
                .redFlags(redFlags)
                .recommendation(aiAnalysis.recommendedAction())
                .threatIndicators(buildThreatIndicators(ruleSignals, aiAnalysis.redFlags()))
                .build();
    }

    private List<RuleSignal> collectEmailRuleSignals(EmailAnalysisRequestDTO request) {
        List<RuleSignal> signals = new ArrayList<>();
        String sender = request.sender().trim();
        String body = request.body();

        if (!EMAIL_ADDRESS_PATTERN.matcher(sender).matches()) {
            signals.add(signal("Sender address is malformed", "Suspicious Email", "HIGH", 24));
        } else {
            String senderDomain = sender.substring(sender.lastIndexOf('@') + 1);
            List<RuleSignal> domainSignals = domainAnalyzer.analyze(senderDomain);
            signals.addAll(domainSignals);
            if (!domainSignals.isEmpty()) {
                signals.add(signal("Sender domain has suspicious characteristics", "Suspicious Email", "HIGH", 14));
            }
        }

        signals.addAll(embeddedUrlSignals(body));
        if (!urlValidator.extractUrls(body).isEmpty()) {
            signals.add(signal("Contains external links", "External Link", "MEDIUM", 10));
        }
        if (URGENCY_PATTERN.matcher(request.subject() + " " + body).find()) {
            signals.add(signal("Uses urgent or account-pressure language", "Urgency", "HIGH", 16));
        }
        if (OTP_PATTERN.matcher(body).find()) {
            signals.add(signal("Requests sensitive verification details", "OTP Request", "CRITICAL", 24));
        }

        return List.copyOf(signals);
    }

    private List<RuleSignal> collectJobRuleSignals(String message) {
        List<RuleSignal> signals = new ArrayList<>();

        if (UNREALISTIC_EARNINGS_PATTERN.matcher(message).find()) {
            signals.add(signal("Promotes unusually high or vague earnings", "Unrealistic Salary", "HIGH", 20));
        }
        if (PAYMENT_PATTERN.matcher(message).find()) {
            signals.add(signal("Requests an upfront fee or payment", "Payment Request", "CRITICAL", 30));
        }
        if (TOO_GOOD_TO_BE_TRUE_PATTERN.matcher(message).find()) {
            signals.add(signal("Uses a too-good-to-be-true job promise", "Job Offer", "HIGH", 18));
        }
        if (URGENCY_PATTERN.matcher(message).find()) {
            signals.add(signal("Uses urgent recruitment language", "Urgency", "MEDIUM", 12));
        }
        if (OTP_PATTERN.matcher(message).find()) {
            signals.add(signal("Requests sensitive verification details", "OTP Request", "CRITICAL", 24));
        }

        List<RuleSignal> urlSignals = embeddedUrlSignals(message);
        signals.addAll(urlSignals);
        if (!urlValidator.extractUrls(message).isEmpty()) {
            signals.add(signal("Contains an external recruitment link", "External Link", "MEDIUM", 10));
        }

        return List.copyOf(signals);
    }

    private List<RuleSignal> embeddedUrlSignals(String text) {
        return urlValidator.analyzeEmbeddedUrls(text).stream()
                .flatMap(assessment -> assessment.signals().stream())
                .toList();
    }

    private SecurityScoreDTO calculateSecurityScore(int ruleRiskScore, int aiRiskScore) {
        int normalizedRuleRisk = Math.min(100, Math.max(0, ruleRiskScore));
        int normalizedAiRisk = Math.min(100, Math.max(0, aiRiskScore));
        int blendedRiskScore = Math.round(normalizedRuleRisk * 0.45F + normalizedAiRisk * 0.55F);
        int safetyFirstRiskScore = Math.max(Math.max(normalizedRuleRisk, normalizedAiRisk), blendedRiskScore);
        return SecurityScoreDTO.fromRiskScore(safetyFirstRiskScore);
    }

    private int ruleRiskScore(List<RuleSignal> ruleSignals) {
        return Math.min(100, ruleSignals.stream().mapToInt(RuleSignal::riskScore).sum());
    }

    private List<String> reasonsFromSignals(List<RuleSignal> ruleSignals) {
        return mergeText(ruleSignals.stream().map(RuleSignal::reason).toList(), List.of());
    }

    private List<String> mergeText(List<String> firstValues, List<String> secondValues) {
        Map<String, String> uniqueValues = new LinkedHashMap<>();
        addUniqueText(uniqueValues, firstValues);
        addUniqueText(uniqueValues, secondValues);
        return List.copyOf(uniqueValues.values());
    }

    private void addUniqueText(Map<String, String> uniqueValues, List<String> values) {
        for (String value : values) {
            String normalizedValue = value.trim().replaceAll("\\s+", " ");
            if (!normalizedValue.isEmpty()) {
                uniqueValues.putIfAbsent(normalizedValue.toLowerCase(Locale.ROOT), normalizedValue);
            }
        }
    }

    private List<ThreatIndicatorDTO> buildThreatIndicators(List<RuleSignal> ruleSignals, List<String> aiRedFlags) {
        Map<String, ThreatIndicatorDTO> indicators = new LinkedHashMap<>();

        for (RuleSignal ruleSignal : ruleSignals) {
            mergeIndicator(indicators, ruleSignal.indicator(), ruleSignal.severity());
        }
        for (String redFlag : aiRedFlags) {
            ThreatIndicatorDTO indicator = indicatorForRedFlag(redFlag);
            mergeIndicator(indicators, indicator.getLabel(), indicator.getSeverity());
        }

        return indicators.values().stream().limit(8).toList();
    }

    private ThreatIndicatorDTO indicatorForRedFlag(String redFlag) {
        String normalizedFlag = redFlag.toLowerCase(Locale.ROOT);
        if (normalizedFlag.contains("otp") || normalizedFlag.contains("code") || normalizedFlag.contains("pin")) {
            return ThreatIndicatorDTO.builder().label("OTP Request").severity("CRITICAL").build();
        }
        if (normalizedFlag.contains("payment") || normalizedFlag.contains("fee") || normalizedFlag.contains("advance")) {
            return ThreatIndicatorDTO.builder().label("Payment Request").severity("HIGH").build();
        }
        if (normalizedFlag.contains("urgent") || normalizedFlag.contains("pressure")) {
            return ThreatIndicatorDTO.builder().label("Urgency").severity("HIGH").build();
        }
        if (normalizedFlag.contains("domain") || normalizedFlag.contains("website")) {
            return ThreatIndicatorDTO.builder().label("Fake Domain").severity("HIGH").build();
        }
        if (normalizedFlag.contains("sender") || normalizedFlag.contains("email")) {
            return ThreatIndicatorDTO.builder().label("Suspicious Email").severity("HIGH").build();
        }
        if (normalizedFlag.contains("link") || normalizedFlag.contains("url")) {
            return ThreatIndicatorDTO.builder().label("External Link").severity("MEDIUM").build();
        }
        return ThreatIndicatorDTO.builder().label("AI Signal").severity("MEDIUM").build();
    }

    private void mergeIndicator(Map<String, ThreatIndicatorDTO> indicators, String label, String severity) {
        ThreatIndicatorDTO existingIndicator = indicators.get(label);
        if (existingIndicator == null || severityRank(severity) > severityRank(existingIndicator.getSeverity())) {
            indicators.put(label, ThreatIndicatorDTO.builder().label(label).severity(severity).build());
        }
    }

    private int severityRank(String severity) {
        return switch (severity) {
            case "CRITICAL" -> 4;
            case "HIGH" -> 3;
            case "MEDIUM" -> 2;
            default -> 1;
        };
    }

    private RuleSignal signal(String reason, String indicator, String severity, int riskScore) {
        return new RuleSignal(reason, indicator, severity, riskScore);
    }
}
