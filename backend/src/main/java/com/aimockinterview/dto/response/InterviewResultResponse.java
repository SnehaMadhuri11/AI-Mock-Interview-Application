package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResultResponse {
    private Long id;
    private Long interviewId;
    private double technicalScore;
    private double communicationScore;
    private double confidenceScore;
    private double overallScore;
    private String feedback;
    private String strengths;
    private String weaknesses;
}
