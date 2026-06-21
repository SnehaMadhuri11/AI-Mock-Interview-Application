package com.aimockinterview.controller;

import com.aimockinterview.dto.request.ChatRequest;
import com.aimockinterview.dto.response.ApiResponse;
import com.aimockinterview.dto.response.ChatResponse;
import com.aimockinterview.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
@Tag(name = "AI Career Assistant", description = "Endpoints for interacting with the AI career assistant chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/ask")
    @Operation(summary = "Ask a career progression or technical question to the AI assistant")
    public ResponseEntity<ApiResponse<ChatResponse>> askChatbot(
            Authentication authentication,
            @Valid @RequestBody ChatRequest request) {
        String email = authentication.getName();
        ChatResponse answer = chatbotService.askQuestion(email, request);
        return ResponseEntity.ok(ApiResponse.success("AI response received", answer));
    }
}
