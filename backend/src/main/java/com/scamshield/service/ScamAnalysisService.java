package com.scamshield.service;

import com.scamshield.dto.ScamAnalysisRequestDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;

public interface ScamAnalysisService {

    ScamAnalysisResponseDTO analyze(ScamAnalysisRequestDTO request);
}
