package com.scamshield.controller;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.ExtractTextResponse;
import com.scamshield.service.TextExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ai")
public class AiController {

    private final TextExtractionService textExtractionService;

    @PostMapping(value = "/extract-text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ExtractTextResponse>> extractText(@RequestPart("image") MultipartFile image) {
        ExtractTextResponse response = textExtractionService.extractText(image);
        return ResponseEntity.ok(ApiResponse.success("Text extracted successfully", response));
    }
}
