package com.scamshield.service;

import com.scamshield.dto.ExtractTextResponse;
import org.springframework.web.multipart.MultipartFile;

public interface TextExtractionService {

    ExtractTextResponse extractText(MultipartFile image);
}
