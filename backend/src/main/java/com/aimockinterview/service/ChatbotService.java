package com.aimockinterview.service;

import com.aimockinterview.dto.request.ChatRequest;
import com.aimockinterview.dto.response.ChatResponse;

public interface ChatbotService {

    ChatResponse askQuestion(String userEmail, ChatRequest request);
}
