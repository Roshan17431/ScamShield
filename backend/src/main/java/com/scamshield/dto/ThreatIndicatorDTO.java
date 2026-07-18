package com.scamshield.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ThreatIndicatorDTO {

    String label;

    String severity;
}
