package com.aimockinterview.service;

import com.aimockinterview.dto.response.DashboardStatsResponse;

public interface DashboardService {

    DashboardStatsResponse getDashboardStats(String userEmail);
}
