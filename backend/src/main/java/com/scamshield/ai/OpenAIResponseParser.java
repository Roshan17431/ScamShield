package com.scamshield.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.exception.OpenAIServiceException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class OpenAIResponseParser {

    private final ObjectMapper objectMapper;

    public String parseExtractedText(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            verifyCompleted(root, "text extraction");

            String outputText = findOutputText(root, "OpenAI could not extract text from this image");
            if (!StringUtils.hasText(outputText)) {
                return "";
            }

            JsonNode structuredOutput = objectMapper.readTree(outputText);
            return normalize(structuredOutput.path("extractedText").asText(""));
        } catch (IOException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.BAD_GATEWAY,
                    "OPENAI_RESPONSE_PARSE_FAILED",
                    "Unable to read the OpenAI text extraction response",
                    exception
            );
        }
    }

    public ScamAnalysisResponseDTO parseScamAnalysis(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            verifyCompleted(root, "scam analysis");

            String outputText = findOutputText(root, "OpenAI could not analyze this message");
            if (!StringUtils.hasText(outputText)) {
                throw malformedAnalysisResponse();
            }

            JsonNode structuredOutput = objectMapper.readTree(outputText);
            return ScamAnalysisResponseDTO.builder()
                    .scamProbability(readScore(structuredOutput, "scamProbability", this::malformedAnalysisResponse))
                    .riskLevel(readRiskLevel(structuredOutput, this::malformedAnalysisResponse))
                    .category(readCategory(structuredOutput, this::malformedAnalysisResponse))
                    .confidence(readScore(structuredOutput, "confidence", this::malformedAnalysisResponse))
                    .summary(readRequiredText(structuredOutput, "summary", this::malformedAnalysisResponse))
                    .explanation(readRequiredText(structuredOutput, "explanation", this::malformedAnalysisResponse))
                    .redFlags(readStringList(structuredOutput, "redFlags", 0, this::malformedAnalysisResponse))
                    .build();
        } catch (OpenAIServiceException exception) {
            throw exception;
        } catch (IOException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.BAD_GATEWAY,
                    "OPENAI_RESPONSE_PARSE_FAILED",
                    "Unable to read the OpenAI scam analysis response",
                    exception
            );
        }
    }

    public ProtectionResponseDTO parseProtectionAdvice(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            verifyCompleted(root, "protection advice");

            String outputText = findOutputText(root, "OpenAI could not generate protection advice");
            if (!StringUtils.hasText(outputText)) {
                throw malformedProtectionResponse();
            }

            JsonNode structuredOutput = objectMapper.readTree(outputText);
            return ProtectionResponseDTO.builder()
                    .recommendedActions(readStringList(
                            structuredOutput,
                            "recommendedActions",
                            1,
                            this::malformedProtectionResponse
                    ))
                    .safeReply(readRequiredText(structuredOutput, "safeReply", this::malformedProtectionResponse))
                    .preventionTips(readStringList(
                            structuredOutput,
                            "preventionTips",
                            1,
                            this::malformedProtectionResponse
                    ))
                    .similarScams(readStringList(
                            structuredOutput,
                            "similarScams",
                            1,
                            this::malformedProtectionResponse
                    ))
                    .build();
        } catch (OpenAIServiceException exception) {
            throw exception;
        } catch (IOException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.BAD_GATEWAY,
                    "OPENAI_RESPONSE_PARSE_FAILED",
                    "Unable to read the OpenAI protection advice response",
                    exception
            );
        }
    }

    public String parseErrorMessage(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String message = root.path("error").path("message").asText();
            return StringUtils.hasText(message) ? message : "OpenAI request failed";
        } catch (IOException exception) {
            return "OpenAI request failed";
        }
    }

    private void verifyCompleted(JsonNode root, String operation) {
        String status = root.path("status").asText("");
        if (!"completed".equals(status)) {
            throw new OpenAIServiceException(
                    HttpStatus.BAD_GATEWAY,
                    "OPENAI_RESPONSE_INCOMPLETE",
                    "OpenAI did not complete " + operation
            );
        }
    }

    private String findOutputText(JsonNode root, String refusalMessage) {
        String outputText = root.path("output_text").asText("");
        if (StringUtils.hasText(outputText)) {
            return outputText;
        }

        for (JsonNode outputItem : root.path("output")) {
            if (!"message".equals(outputItem.path("type").asText())) {
                continue;
            }

            for (JsonNode contentItem : outputItem.path("content")) {
                if ("refusal".equals(contentItem.path("type").asText())) {
                    throw new OpenAIServiceException(
                            HttpStatus.BAD_GATEWAY,
                            "OPENAI_REFUSAL",
                            refusalMessage
                    );
                }

                if ("output_text".equals(contentItem.path("type").asText())) {
                    return contentItem.path("text").asText("");
                }
            }
        }

        return "";
    }

    private int readScore(
            JsonNode structuredOutput,
            String fieldName,
            Supplier<OpenAIServiceException> malformedResponse
    ) {
        JsonNode field = structuredOutput.path(fieldName);
        if (!field.isIntegralNumber() || field.intValue() < 0 || field.intValue() > 100) {
            throw malformedResponse.get();
        }

        return field.intValue();
    }

    private String readRiskLevel(
            JsonNode structuredOutput,
            Supplier<OpenAIServiceException> malformedResponse
    ) {
        String riskLevel = readRequiredText(structuredOutput, "riskLevel", malformedResponse);
        if (!ScamAnalysisContract.RISK_LEVELS.contains(riskLevel)) {
            throw malformedResponse.get();
        }

        return riskLevel;
    }

    private String readCategory(
            JsonNode structuredOutput,
            Supplier<OpenAIServiceException> malformedResponse
    ) {
        String category = readRequiredText(structuredOutput, "category", malformedResponse);
        if (!ScamAnalysisContract.CATEGORIES.contains(category)) {
            throw malformedResponse.get();
        }

        return category;
    }

    private String readRequiredText(
            JsonNode structuredOutput,
            String fieldName,
            Supplier<OpenAIServiceException> malformedResponse
    ) {
        JsonNode field = structuredOutput.path(fieldName);
        if (!field.isTextual() || !StringUtils.hasText(field.asText())) {
            throw malformedResponse.get();
        }

        return normalize(field.asText());
    }

    private List<String> readStringList(
            JsonNode structuredOutput,
            String fieldName,
            int minimumSize,
            Supplier<OpenAIServiceException> malformedResponse
    ) {
        JsonNode values = structuredOutput.path(fieldName);
        if (!values.isArray() || values.size() < minimumSize) {
            throw malformedResponse.get();
        }

        List<String> parsedValues = new ArrayList<>();
        for (JsonNode value : values) {
            if (!value.isTextual() || !StringUtils.hasText(value.asText())) {
                throw malformedResponse.get();
            }
            parsedValues.add(normalize(value.asText()));
        }

        return List.copyOf(parsedValues);
    }

    private OpenAIServiceException malformedAnalysisResponse() {
        return new OpenAIServiceException(
                HttpStatus.BAD_GATEWAY,
                "OPENAI_RESPONSE_PARSE_FAILED",
                "Unable to read the OpenAI scam analysis response"
        );
    }

    private OpenAIServiceException malformedProtectionResponse() {
        return new OpenAIServiceException(
                HttpStatus.BAD_GATEWAY,
                "OPENAI_RESPONSE_PARSE_FAILED",
                "Unable to read the OpenAI protection advice response"
        );
    }

    private String normalize(String text) {
        return text.replace("\r\n", "\n").trim();
    }
}
