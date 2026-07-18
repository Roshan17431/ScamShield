package com.scamshield.controller;

import com.scamshield.dto.ApiResponse;
import com.scamshield.dto.ChatRequestDTO;
import com.scamshield.dto.ChatResponseDTO;
import com.scamshield.service.ChatService;
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
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<ChatResponseDTO>> answer(@Valid @RequestBody ChatRequestDTO request) {
        ChatResponseDTO response = chatService.answer(request);
        return ResponseEntity.ok(ApiResponse.success("Safety Coach response generated", response));
    }
}
