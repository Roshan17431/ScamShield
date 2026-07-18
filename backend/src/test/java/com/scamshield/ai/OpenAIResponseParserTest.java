package com.scamshield.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scamshield.exception.OpenAIServiceException;
import org.junit.jupiter.api.Test;

class OpenAIResponseParserTest {

    private final OpenAIResponseParser parser = new OpenAIResponseParser(new ObjectMapper());

    @Test
    void parsesStructuredExtractedText() {
        String responseBody = """
                {
                  "status": "completed",
                  "output": [
                    {
                      "type": "message",
                      "content": [
                        {
                          "type": "output_text",
                          "text": "{\\"extractedText\\":\\"Dear Customer\\\\nVerify now\\"}"
                        }
                      ]
                    }
                  ]
                }
                """;

        String extractedText = parser.parseExtractedText(responseBody);

        assertThat(extractedText).isEqualTo("Dear Customer\nVerify now");
    }

    @Test
    void rejectsIncompleteResponses() {
        String responseBody = """
                {
                  "status": "incomplete",
                  "output": []
                }
                """;

        assertThatThrownBy(() -> parser.parseExtractedText(responseBody))
                .isInstanceOf(OpenAIServiceException.class)
                .hasMessage("OpenAI did not complete text extraction");
    }

    @Test
    void parsesStructuredScamAnalysis() {
        String responseBody = """
                {
                  "status": "completed",
                  "output": [
                    {
                      "type": "message",
                      "content": [
                        {
                          "type": "output_text",
                          "text": "{\\"scamProbability\\":98,\\"riskLevel\\":\\"CRITICAL\\",\\"category\\":\\"Banking Phishing\\",\\"confidence\\":96,\\"summary\\":\\"This message is highly likely to be a phishing attempt.\\",\\"explanation\\":\\"It creates urgency and impersonates a bank.\\",\\"redFlags\\":[\\"Urgent language\\",\\"Fake bank impersonation\\"]}"
                        }
                      ]
                    }
                  ]
                }
                """;

        var analysis = parser.parseScamAnalysis(responseBody);

        assertThat(analysis.getScamProbability()).isEqualTo(98);
        assertThat(analysis.getRiskLevel()).isEqualTo("CRITICAL");
        assertThat(analysis.getRedFlags()).containsExactly("Urgent language", "Fake bank impersonation");
    }

    @Test
    void rejectsMalformedScamAnalysis() {
        String responseBody = """
                {
                  "status": "completed",
                  "output_text": "{\\"scamProbability\\":125}"
                }
                """;

        assertThatThrownBy(() -> parser.parseScamAnalysis(responseBody))
                .isInstanceOf(OpenAIServiceException.class)
                .hasMessage("Unable to read the OpenAI scam analysis response");
    }

    @Test
    void parsesStructuredProtectionAdvice() {
        String responseBody = """
                {
                  "status": "completed",
                  "output_text": "{\\"recommendedActions\\":[\\"Do not open the link.\\",\\"Contact the bank through its official website.\\"],\\"safeReply\\":\\"I will verify this through the official bank website.\\",\\"preventionTips\\":[\\"Never share your OTP.\\"],\\"similarScams\\":[\\"Fake KYC Update\\",\\"Account Suspension\\"]}"
                }
                """;

        var advice = parser.parseProtectionAdvice(responseBody);

        assertThat(advice.getRecommendedActions()).containsExactly(
                "Do not open the link.",
                "Contact the bank through its official website."
        );
        assertThat(advice.getSafeReply()).isEqualTo("I will verify this through the official bank website.");
        assertThat(advice.getSimilarScams()).containsExactly("Fake KYC Update", "Account Suspension");
    }
}
