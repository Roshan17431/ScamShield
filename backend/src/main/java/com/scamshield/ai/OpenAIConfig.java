package com.scamshield.ai;

import java.net.URI;
import java.time.Duration;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@Getter
@Setter
@ConfigurationProperties(prefix = "openai")
public class OpenAIConfig {

    private String apiKey = "";

    private String model = "gpt-5-mini";

    private String baseUrl = "https://api.openai.com/v1";

    private long timeoutSeconds = 45;

    public boolean hasApiKey() {
        return StringUtils.hasText(apiKey);
    }

    public URI responsesUri() {
        return URI.create(baseUrl.replaceAll("/+$", "") + "/responses");
    }

    public Duration timeout() {
        return Duration.ofSeconds(timeoutSeconds);
    }
}
