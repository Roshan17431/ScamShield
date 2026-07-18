package com.scamshield.service;

import com.scamshield.dto.ChatRequestDTO;
import com.scamshield.dto.ChatResponseDTO;

public interface ChatService {

    ChatResponseDTO answer(ChatRequestDTO request);
}
