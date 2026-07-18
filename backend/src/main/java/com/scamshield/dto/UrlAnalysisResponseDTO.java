package com.scamshield.dto;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UrlAnalysisResponseDTO {

    List<String> analyzedUrls;

    boolean safe;

    int securityScore;

    String riskLevel;

    String category;

    int confidence;

    String summary;

    String explanation;

    List<String> reasons;

    String recommendation;

    List<ThreatIndicatorDTO> threatIndicators;
}
