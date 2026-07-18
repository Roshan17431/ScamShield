package com.scamshield.dto;

import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ScamReportDTO {

    String riskLevel;

    String category;

    List<String> redFlags;

    List<String> recommendedActions;

    List<String> preventionTips;

    Instant generatedAt;
}
