package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysisResponse {
    private Long id;
    private double atsScore;
    private String extractedSkills;
    private String missingSkills;
    private String recommendations;
    private LocalDateTime createdAt;
}
