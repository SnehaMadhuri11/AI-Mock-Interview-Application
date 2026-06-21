package com.aimockinterview.controller;

import com.aimockinterview.dto.response.ApiResponse;
import com.aimockinterview.dto.response.CareerRecommendationsResponse;
import com.aimockinterview.service.CareerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/career")
@Tag(name = "Career Advisor", description = "Endpoints for retrieving AI-powered career paths and roadmaps")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get career preparation strategy and certification guidelines based on skills and mock scores")
    public ResponseEntity<ApiResponse<CareerRecommendationsResponse>> getRecommendations(Authentication authentication) {
        String email = authentication.getName();
        CareerRecommendationsResponse recommendations = careerService.getRecommendations(email);
        return ResponseEntity.ok(ApiResponse.success("Career recommendations loaded successfully", recommendations));
    }
}
