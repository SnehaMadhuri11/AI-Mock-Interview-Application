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
public class InterviewResponse {
    private Long id;
    private String category;
    private String difficulty;
    private String interviewType;
    private double score;
    private String feedback;
    private LocalDateTime createdAt;
}
