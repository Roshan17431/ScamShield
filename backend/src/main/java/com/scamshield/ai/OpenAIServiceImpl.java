package com.scamshield.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scamshield.dto.EmailAnalysisRequestDTO;
import com.scamshield.dto.ChatResponseDTO;
import com.scamshield.dto.JobScamRequestDTO;
import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.exception.OpenAIConfigurationException;
import com.scamshield.exception.OpenAIServiceException;
import com.scamshield.model.UploadedImage;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.util.Map;
import java.util.List;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAIServiceImpl implements OpenAIService {

    private final OpenAIConfig config;

    private final PromptBuilder promptBuilder;

    private final ProtectionPromptBuilder protectionPromptBuilder;

    private final SafetyCoachPromptBuilder safetyCoachPromptBuilder;

    private final AdvancedPromptBuilder advancedPromptBuilder;

    private final OpenAIResponseParser responseParser;

    private final ObjectMapper objectMapper;

    @Override
    public String extractTextFromImage(UploadedImage image) {
        return executeRequest(
                promptBuilder.buildVisionOcrRequest(config, image),
                responseParser::parseExtractedText,
                "text extraction",
                "OpenAI could not extract text from the image"
        );
    }

    @Override
    public ScamAnalysisResponseDTO analyzeText(String text) {
        return executeRequest(
                promptBuilder.buildScamAnalysisRequest(config, text),
                responseParser::parseScamAnalysis,
                "scam analysis",
                "OpenAI could not analyze the message"
        );
    }

    @Override
    public ProtectionResponseDTO generateProtectionAdvice(ProtectionRequestDTO request) {
        return executeRequest(
                protectionPromptBuilder.buildProtectionRequest(config, request),
                responseParser::parseProtectionAdvice,
                "protection advice",
                "OpenAI could not generate protection advice"
        );
    }

    @Override
    public ChatResponseDTO answerSafetyCoachQuestion(String message) {
        return executeRequest(
                safetyCoachPromptBuilder.buildSafetyCoachRequest(config, message),
                responseParser::parseSafetyCoachAnswer,
                "Safety Coach response",
                "OpenAI could not generate a Safety Coach response"
        );
    }

    @Override
    public AdvancedAiAnalysis analyzeUrls(List<String> urls, List<String> ruleFindings) {
        return executeRequest(
                advancedPromptBuilder.buildUrlAnalysisRequest(config, urls, ruleFindings),
                responseParser::parseUrlAnalysis,
                "URL analysis",
                "OpenAI could not analyze the URL"
        );
    }

    @Override
    public AdvancedAiAnalysis analyzeEmail(EmailAnalysisRequestDTO request, List<String> ruleFindings) {
        return executeRequest(
                advancedPromptBuilder.buildEmailAnalysisRequest(config, request, ruleFindings),
                responseParser::parseEmailAnalysis,
                "email analysis",
                "OpenAI could not analyze the email"
        );
    }

    @Override
    public AdvancedAiAnalysis analyzeJobOffer(JobScamRequestDTO request, List<String> ruleFindings) {
        return executeRequest(
                advancedPromptBuilder.buildJobScamAnalysisRequest(config, request, ruleFindings),
                responseParser::parseJobScamAnalysis,
                "job scam analysis",
                "OpenAI could not analyze the job offer"
        );
    }

    private <T> T executeRequest(
            Map<String, Object> requestBody,
            Function<String, T> responseHandler,
            String operation,
            String providerFailureMessage
    ) {
        if (!config.hasApiKey()) {
            throw new OpenAIConfigurationException("OPENAI_API_KEY is not configured on the backend");
        }

        HttpRequest request = buildRequest(requestBody, operation);
        try (HttpClient client = HttpClient.newBuilder()
                .connectTimeout(config.timeout())
                .build()) {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                handleNonSuccessResponse(response, providerFailureMessage);
            }

            return responseHandler.apply(response.body());
        } catch (HttpTimeoutException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.GATEWAY_TIMEOUT,
                    "OPENAI_TIMEOUT",
                    "OpenAI " + operation + " timed out",
                    exception
            );
        } catch (IOException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "OPENAI_UNAVAILABLE",
                    "OpenAI is currently unavailable",
                    exception
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new OpenAIServiceException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "OPENAI_INTERRUPTED",
                    "OpenAI " + operation + " was interrupted",
                    exception
            );
        }
    }

    private HttpRequest buildRequest(Map<String, Object> requestBody, String operation) {
        String body = serializeRequestBody(requestBody, operation);
        return HttpRequest.newBuilder(config.responsesUri())
                .timeout(config.timeout())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.getApiKey())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
    }

    private String serializeRequestBody(Map<String, Object> requestBody, String operation) {
        try {
            return objectMapper.writeValueAsString(requestBody);
        } catch (JsonProcessingException exception) {
            throw new OpenAIServiceException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "OPENAI_REQUEST_SERIALIZATION_FAILED",
                    "Unable to prepare OpenAI " + operation + " request",
                    exception
            );
        }
    }

    private void handleNonSuccessResponse(HttpResponse<String> response, String providerFailureMessage) {
        String providerMessage = responseParser.parseErrorMessage(response.body());
        log.warn("OpenAI request failed with status {}: {}", response.statusCode(), providerMessage);
        HttpStatus status = response.statusCode() == 401
                ? HttpStatus.SERVICE_UNAVAILABLE
                : HttpStatus.BAD_GATEWAY;
        String message = response.statusCode() == 401
                ? "OpenAI API key is invalid or unauthorized"
                : providerFailureMessage;
        throw new OpenAIServiceException(status, "OPENAI_REQUEST_FAILED", message);
    }
}
