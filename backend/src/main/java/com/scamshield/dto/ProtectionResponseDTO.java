package com.scamshield.dto;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class ProtectionResponseDTO {

    List<String> recommendedActions;

    String safeReply;

    List<String> preventionTips;

    List<String> similarScams;

    ScamReportDTO report;
}
