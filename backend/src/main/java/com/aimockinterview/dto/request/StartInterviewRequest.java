package com.aimockinterview.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartInterviewRequest {

    @NotBlank(message = "Category is required")
    private String category; // e.g. Java, Python

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // EASY, MEDIUM, HARD

    @NotBlank(message = "Interview type is required")
    private String interviewType; // TECHNICAL, HR, BEHAVIORAL, SYSTEM_DESIGN
}
