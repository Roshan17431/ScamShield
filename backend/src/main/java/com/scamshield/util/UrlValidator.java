package com.scamshield.util;

import com.scamshield.exception.InvalidUrlException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UrlValidator {

    private static final Pattern URL_PATTERN = Pattern.compile(
            "(?i)(?:https?://|www\\.)[^\\s<>()]+|(?<![@\\w-])(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+(?:[a-z]{2,63})(?:/[^\\s<>()]*)?"
    );

    private static final Pattern SCHEME_PATTERN = Pattern.compile("(?i)^[a-z][a-z0-9+.-]*://.*$");

    private static final Set<String> URL_SHORTENERS = Set.of(
            "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "shorturl.at"
    );

    private final DomainAnalyzer domainAnalyzer;

    public List<UrlRuleAssessment> analyzeInput(String input) {
        List<String> extractedUrls = extractUrls(input);
        List<String> urlsToAnalyze = extractedUrls.isEmpty() ? List.of(input.trim()) : extractedUrls;

        return urlsToAnalyze.stream()
                .map(this::analyze)
                .toList();
    }

    public List<UrlRuleAssessment> analyzeEmbeddedUrls(String text) {
        return extractUrls(text).stream()
                .map(this::analyze)
                .toList();
    }

    public List<String> extractUrls(String text) {
        Matcher matcher = URL_PATTERN.matcher(text);
        LinkedHashSet<String> urls = new LinkedHashSet<>();

        while (matcher.find()) {
            String candidate = stripTrailingPunctuation(matcher.group());
            if (!candidate.isBlank()) {
                urls.add(candidate);
            }
        }

        return List.copyOf(urls);
    }

    public UrlRuleAssessment analyze(String rawUrl) {
        String normalizedUrl = normalizeUrl(rawUrl);
        URI uri = parseUri(normalizedUrl);
        String host = uri.getHost();
        List<RuleSignal> signals = new ArrayList<>();

        if ("http".equalsIgnoreCase(uri.getScheme())) {
            signals.add(signal("Uses HTTP instead of HTTPS", "HTTP", "HIGH", 22));
        }
        if (uri.getUserInfo() != null) {
            signals.add(signal("Contains hidden user information before the destination", "Redirect Pattern", "HIGH", 18));
        }
        if (domainAnalyzer.isIpAddress(host)) {
            signals.add(signal("Uses an IP address instead of a recognizable domain", "Fake Domain", "CRITICAL", 30));
        } else {
            signals.addAll(domainAnalyzer.analyze(host));
        }
        if (isShortenedUrl(host)) {
            signals.add(signal("Uses a URL shortener that hides the final destination", "Short URL", "MEDIUM", 16));
        }
        if (normalizedUrl.length() > 180) {
            signals.add(signal("URL is unusually long and may obscure its destination", "Long URL", "LOW", 8));
        }
        if (hasRedirectPattern(normalizedUrl)) {
            signals.add(signal("Contains parameters commonly used for redirects", "Redirect Pattern", "HIGH", 18));
        }

        int riskScore = Math.min(100, signals.stream().mapToInt(RuleSignal::riskScore).sum());
        return new UrlRuleAssessment(normalizedUrl, signals, riskScore);
    }

    private String normalizeUrl(String rawUrl) {
        String candidate = stripTrailingPunctuation(rawUrl.trim());
        if (candidate.isBlank()) {
            throw new InvalidUrlException("Enter a valid public HTTP or HTTPS URL");
        }

        if (candidate.regionMatches(true, 0, "www.", 0, 4)) {
            candidate = "https://" + candidate;
        } else if (!SCHEME_PATTERN.matcher(candidate).matches()) {
            if (looksLikePublicDomain(candidate)) {
                candidate = "https://" + candidate;
            } else {
                throw new InvalidUrlException("Enter a valid public HTTP or HTTPS URL");
            }
        }

        URI uri = parseUri(candidate);
        if (!"http".equalsIgnoreCase(uri.getScheme()) && !"https".equalsIgnoreCase(uri.getScheme())) {
            throw new InvalidUrlException("Only HTTP and HTTPS URLs can be analyzed");
        }
        if (uri.getHost() == null || uri.getHost().isBlank() || !looksLikePublicHost(uri.getHost())) {
            throw new InvalidUrlException("Enter a valid public HTTP or HTTPS URL");
        }

        return uri.toASCIIString();
    }

    private URI parseUri(String value) {
        try {
            return new URI(value);
        } catch (URISyntaxException exception) {
            throw new InvalidUrlException("Enter a valid public HTTP or HTTPS URL");
        }
    }

    private boolean looksLikePublicDomain(String value) {
        String candidate = value.toLowerCase(Locale.ROOT);
        return candidate.matches("(?:[a-z0-9-]+\\.)+[a-z]{2,63}(?:/.*)?");
    }

    private boolean looksLikePublicHost(String host) {
        return domainAnalyzer.isIpAddress(host) || host.contains(".");
    }

    private boolean isShortenedUrl(String host) {
        String normalizedHost = host.toLowerCase(Locale.ROOT);
        return URL_SHORTENERS.contains(normalizedHost) || URL_SHORTENERS.stream()
                .anyMatch(shortener -> normalizedHost.endsWith("." + shortener));
    }

    private boolean hasRedirectPattern(String url) {
        String normalizedUrl = url.toLowerCase(Locale.ROOT);
        int embeddedUrlCount = countOccurrences(normalizedUrl, "http://") + countOccurrences(normalizedUrl, "https://");
        return embeddedUrlCount > 1
                || normalizedUrl.matches(".*[?&](url|redirect|next|continue|return)=.*")
                || normalizedUrl.contains("%2f%2f");
    }

    private int countOccurrences(String value, String target) {
        int count = 0;
        int position = 0;
        while ((position = value.indexOf(target, position)) >= 0) {
            count += 1;
            position += target.length();
        }
        return count;
    }

    private String stripTrailingPunctuation(String value) {
        String cleanedValue = value;
        while (!cleanedValue.isEmpty() && ".,;:!?)]}".indexOf(cleanedValue.charAt(cleanedValue.length() - 1)) >= 0) {
            cleanedValue = cleanedValue.substring(0, cleanedValue.length() - 1);
        }
        return cleanedValue;
    }

    private RuleSignal signal(String reason, String indicator, String severity, int riskScore) {
        return new RuleSignal(reason, indicator, severity, riskScore);
    }
}
