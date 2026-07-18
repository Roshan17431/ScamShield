package com.scamshield.ai;

import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.model.UploadedImage;

public interface OpenAIService {

    String extractTextFromImage(UploadedImage image);

    ScamAnalysisResponseDTO analyzeText(String text);

    ProtectionResponseDTO generateProtectionAdvice(ProtectionRequestDTO request);
}
