package com.aimockinterview.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interview_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "technical_score")
    @Builder.Default
    private double technicalScore = 0.0;

    @Column(name = "communication_score")
    @Builder.Default
    private double communicationScore = 0.0;

    @Column(name = "confidence_score")
    @Builder.Default
    private double confidenceScore = 0.0;

    @Column(name = "overall_score")
    @Builder.Default
    private double overallScore = 0.0;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String strengths; // comma separated or text

    @Column(columnDefinition = "TEXT")
    private String weaknesses; // comma separated or text
}
