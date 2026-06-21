package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalInterviews;
    private double averageScore;
    private double bestScore;
    private List<String> weakAreas;
    private List<String> strongAreas;
}
