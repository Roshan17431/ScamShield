package com.scamshield.service;

import com.scamshield.dto.EmailAnalysisRequestDTO;
import com.scamshield.dto.EmailAnalysisResponseDTO;
import com.scamshield.dto.JobScamRequestDTO;
import com.scamshield.dto.JobScamResponseDTO;
import com.scamshield.dto.UrlAnalysisRequestDTO;
import com.scamshield.dto.UrlAnalysisResponseDTO;

public interface AdvancedDetectionService {

    UrlAnalysisResponseDTO analyzeUrl(UrlAnalysisRequestDTO request);

    EmailAnalysisResponseDTO analyzeEmail(EmailAnalysisRequestDTO request);

    JobScamResponseDTO analyzeJobOffer(JobScamRequestDTO request);
}
