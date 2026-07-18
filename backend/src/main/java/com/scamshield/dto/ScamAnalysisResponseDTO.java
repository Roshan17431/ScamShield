package com.scamshield.dto;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ScamAnalysisResponseDTO {

    int scamProbability;

    String riskLevel;

    String category;

    int confidence;

    String summary;

    String explanation;

    List<String> redFlags;
}
