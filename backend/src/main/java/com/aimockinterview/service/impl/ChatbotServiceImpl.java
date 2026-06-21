package com.aimockinterview.service.impl;

import com.aimockinterview.ai.AIInterviewService;
import com.aimockinterview.dto.request.ChatRequest;
import com.aimockinterview.dto.response.ChatResponse;
import com.aimockinterview.service.ChatbotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final AIInterviewService aiInterviewService;

    public ChatbotServiceImpl(AIInterviewService aiInterviewService) {
        this.aiInterviewService = aiInterviewService;
    }

    @Override
    public ChatResponse askQuestion(String userEmail, ChatRequest request) {
        log.info("User {} asked chatbot: {}", userEmail, request.getQuestion());
        String answer = aiInterviewService.askChatbot(request.getQuestion());
        return ChatResponse.builder()
                .answer(answer)
                .build();
    }
}
