package com.scamshield.service.impl;

import com.scamshield.ai.OpenAIService;
import com.scamshield.dto.ChatRequestDTO;
import com.scamshield.dto.ChatResponseDTO;
import com.scamshield.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final OpenAIService openAIService;

    @Override
    public ChatResponseDTO answer(ChatRequestDTO request) {
        ChatResponseDTO response = openAIService.answerSafetyCoachQuestion(request.message());
        log.info("Safety Coach response generated: questionCharacters={}, answerCharacters={}",
                request.message().length(), response.answer().length());
        return response;
    }
}
