package com.scamshield.controller;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.ScamAnalysisRequestDTO;
import com.scamshield.dto.ScamAnalysisResponseDTO;
import com.scamshield.service.ScamAnalysisService;
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
public class ScamAnalysisController {

    private final ScamAnalysisService scamAnalysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<ScamAnalysisResponseDTO>> analyze(
            @Valid @RequestBody ScamAnalysisRequestDTO request
    ) {
        ScamAnalysisResponseDTO response = scamAnalysisService.analyze(request);
        return ResponseEntity.ok(ApiResponse.success("Message analyzed successfully", response));
    }
}
