package com.scamshield.service.impl;

import com.scamshield.ai.OpenAIService;
import com.scamshield.dto.ScamAnalysisRequestDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.service.ScamAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScamAnalysisServiceImpl implements ScamAnalysisService {

    private final OpenAIService openAIService;

    @Override
    public ScamAnalysisResponseDTO analyze(ScamAnalysisRequestDTO request) {
        ScamAnalysisResponseDTO response = openAIService.analyzeText(request.text());

        log.info(
                "Scam analysis completed: characters={}, scamProbability={}, riskLevel={}",
                request.text().length(),
                response.getScamProbability(),
                response.getRiskLevel()
        );

        return response;
    }
}
