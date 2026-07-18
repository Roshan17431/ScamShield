package com.scamshield.ai;

import com.scamshield.dto.EmailAnalysisRequestDTO;
import com.scamshield.dto.ChatResponseDTO;
import com.scamshield.dto.JobScamRequestDTO;
import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.model.UploadedImage;
import java.util.List;

public interface OpenAIService {

    String extractTextFromImage(UploadedImage image);

    ScamAnalysisResponseDTO analyzeText(String text);

    ProtectionResponseDTO generateProtectionAdvice(ProtectionRequestDTO request);

    ChatResponseDTO answerSafetyCoachQuestion(String message);

    AdvancedAiAnalysis analyzeUrls(List<String> urls, List<String> ruleFindings);

    AdvancedAiAnalysis analyzeEmail(EmailAnalysisRequestDTO request, List<String> ruleFindings);

    AdvancedAiAnalysis analyzeJobOffer(JobScamRequestDTO request, List<String> ruleFindings);
}
