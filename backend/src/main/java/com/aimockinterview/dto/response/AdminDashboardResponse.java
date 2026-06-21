package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalInterviews;
    private long totalResumeAnalyses;
    private long activeUsersCount;
    private double averageInterviewScore;
}
