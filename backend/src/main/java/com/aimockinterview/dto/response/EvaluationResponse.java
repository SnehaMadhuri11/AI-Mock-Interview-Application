package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResponse {
    private Long questionId;
    private String answer;
    private double technicalScore;
    private double communicationScore;
    private double clarityScore;
    private double completenessScore;
    private String feedback;
    private String suggestions;
}
