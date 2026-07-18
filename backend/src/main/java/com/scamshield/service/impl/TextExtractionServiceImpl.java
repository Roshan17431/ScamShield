package com.scamshield.service.impl;

import com.scamshield.ai.OpenAIService;
import com.scamshield.dto.ExtractTextResponse;
import com.scamshield.model.UploadedImage;
import com.scamshield.service.TextExtractionService;
import com.scamshield.util.ImageValidationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class TextExtractionServiceImpl implements TextExtractionService {

    private final ImageValidationUtil imageValidationUtil;

    private final OpenAIService openAIService;

    @Override
    public ExtractTextResponse extractText(MultipartFile image) {
        UploadedImage uploadedImage = imageValidationUtil.validateAndRead(image);
        String extractedText = openAIService.extractTextFromImage(uploadedImage);

        log.info("Text extraction completed: characters={}, imageBytes={}",
                extractedText.length(),
                uploadedImage.sizeInBytes());

        return ExtractTextResponse.builder()
                .extractedText(extractedText)
                .build();
    }
}
