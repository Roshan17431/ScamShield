package com.scamshield.controller;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.ProtectionRequestDTO;
import com.scamshield.dto.ProtectionResponseDTO;
import com.scamshield.service.ProtectionService;
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
public class ProtectionController {

    private final ProtectionService protectionService;

    @PostMapping(value = "/protection", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<ProtectionResponseDTO>> generate(
            @Valid @RequestBody ProtectionRequestDTO request
    ) {
        ProtectionResponseDTO response = protectionService.generate(request);
        return ResponseEntity.ok(ApiResponse.success("Protection advice generated successfully", response));
    }
}
