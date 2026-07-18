package com.scamshield.service.impl;

import com.scamshield.ai.OpenAIService;
import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.dto.ScamReportDTO;
import com.scamshield.service.ProtectionService;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProtectionServiceImpl implements ProtectionService {

    private final OpenAIService openAIService;

    @Override
    public ProtectionResponseDTO generate(ProtectionRequestDTO request) {
        ProtectionResponseDTO advice = openAIService.generateProtectionAdvice(request);
        ScamReportDTO report = ScamReportDTO.builder()
                .riskLevel(request.riskLevel())
                .category(request.category())
                .redFlags(List.copyOf(request.redFlags()))
                .recommendedActions(advice.getRecommendedActions())
                .preventionTips(advice.getPreventionTips())
                .generatedAt(Instant.now())
                .build();

        log.info(
                "Protection advice generated: riskLevel={}, category={}, redFlagCount={}",
                request.riskLevel(),
                request.category(),
                request.redFlags().size()
        );

        return advice.toBuilder()
                .report(report)
                .build();
    }
}
