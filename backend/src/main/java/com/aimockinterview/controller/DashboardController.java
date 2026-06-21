package com.aimockinterview.controller;

import com.aimockinterview.dto.response.ApiResponse;
import com.aimockinterview.dto.response.DashboardStatsResponse;
import com.aimockinterview.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard Stats", description = "Endpoints for retrieving aggregate candidate metrics and metrics analytics")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get user mock interview metrics and key strengths/weaknesses")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats(Authentication authentication) {
        String email = authentication.getName();
        DashboardStatsResponse stats = dashboardService.getDashboardStats(email);
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics loaded successfully", stats));
    }
}
