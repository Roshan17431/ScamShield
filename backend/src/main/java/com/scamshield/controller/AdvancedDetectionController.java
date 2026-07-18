package com.scamshield.controller;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.EmailAnalysisRequestDTO;
import com.scamshield.dto.EmailAnalysisResponseDTO;
import com.scamshield.dto.JobScamRequestDTO;
import com.scamshield.dto.JobScamResponseDTO;
import com.scamshield.dto.UrlAnalysisRequestDTO;
import com.scamshield.dto.UrlAnalysisResponseDTO;
import com.scamshield.service.AdvancedDetectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/scam")
public class AdvancedDetectionController {

    private final AdvancedDetectionService advancedDetectionService;

    @PostMapping(value = "/url-analysis", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<UrlAnalysisResponseDTO>> analyzeUrl(
            @Valid @RequestBody UrlAnalysisRequestDTO request
    ) {
        UrlAnalysisResponseDTO response = advancedDetectionService.analyzeUrl(request);
        return ResponseEntity.ok(ApiResponse.success("URL analyzed successfully", response));
    }

    @PostMapping(value = "/email-analysis", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<EmailAnalysisResponseDTO>> analyzeEmail(
            @Valid @RequestBody EmailAnalysisRequestDTO request
    ) {
        EmailAnalysisResponseDTO response = advancedDetectionService.analyzeEmail(request);
        return ResponseEntity.ok(ApiResponse.success("Email analyzed successfully", response));
    }

    @PostMapping(value = "/job-analysis", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<JobScamResponseDTO>> analyzeJobOffer(
            @Valid @RequestBody JobScamRequestDTO request
    ) {
        JobScamResponseDTO response = advancedDetectionService.analyzeJobOffer(request);
        return ResponseEntity.ok(ApiResponse.success("Job offer analyzed successfully", response));
    }
}
