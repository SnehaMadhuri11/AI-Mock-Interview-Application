package com.aimockinterview.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "answer_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(name = "technical_score")
    @Builder.Default
    private double technicalScore = 0.0;

    @Column(name = "communication_score")
    @Builder.Default
    private double communicationScore = 0.0;

    @Column(name = "clarity_score")
    @Builder.Default
    private double clarityScore = 0.0;

    @Column(name = "completeness_score")
    @Builder.Default
    private double completenessScore = 0.0;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
