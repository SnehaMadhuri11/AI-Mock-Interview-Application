package com.aimockinterview.service;

import com.aimockinterview.dto.response.CareerRecommendationsResponse;

public interface CareerService {

    CareerRecommendationsResponse getRecommendations(String userEmail);
}
