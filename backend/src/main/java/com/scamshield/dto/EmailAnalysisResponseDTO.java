package com.scamshield.dto;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class EmailAnalysisResponseDTO {

    int securityScore;

    String riskLevel;

    String category;

    int confidence;

    String summary;

    String explanation;

    List<String> redFlags;

    String recommendation;

    List<ThreatIndicatorDTO> threatIndicators;
}
