package com.aimockinterview.controller;

import com.aimockinterview.dto.request.StartInterviewRequest;
import com.aimockinterview.dto.request.SubmitAnswerRequest;
import com.aimockinterview.dto.response.*;
import com.aimockinterview.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interview")
@Tag(name = "AI Mock Interview", description = "Endpoints for starting interviews, submitting answers, and tracking performance results")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/start")
    @Operation(summary = "Initiate a mock interview and generate questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> startInterview(
            Authentication authentication,
            @Valid @RequestBody StartInterviewRequest request) {
        String email = authentication.getName();
        List<QuestionResponse> questions = interviewService.startInterview(email, request);
        return ResponseEntity.ok(ApiResponse.success("Mock interview started successfully", questions));
    }

    @PostMapping("/submit-answer")
    @Operation(summary = "Submit an answer for a single interview question for AI evaluation")
    public ResponseEntity<ApiResponse<EvaluationResponse>> submitAnswer(
            Authentication authentication,
            @Valid @RequestBody SubmitAnswerRequest request) {
        String email = authentication.getName();
        EvaluationResponse evaluation = interviewService.submitAnswer(email, request);
        return ResponseEntity.ok(ApiResponse.success("Answer evaluated and recorded", evaluation));
    }

    @GetMapping("/result/{id}")
    @Operation(summary = "Compile and fetch the overall result of a mock interview session")
    public ResponseEntity<ApiResponse<InterviewResultResponse>> getInterviewResult(
            Authentication authentication,
            @PathVariable("id") Long interviewId) {
        String email = authentication.getName();
        InterviewResultResponse result = interviewService.getInterviewResult(interviewId, email);
        return ResponseEntity.ok(ApiResponse.success("Interview results compiled", result));
    }

    @GetMapping("/history")
    @Operation(summary = "Retrieve paginated list of candidate's interview sessions history")
    public ResponseEntity<ApiResponse<Page<InterviewResponse>>> getInterviewHistory(
            Authentication authentication,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        String email = authentication.getName();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<InterviewResponse> history = interviewService.getInterviewHistory(email, pageRequest);
        return ResponseEntity.ok(ApiResponse.success("Interview history retrieved", history));
    }

    @GetMapping("/report/{id}")
    @Operation(summary = "Retrieve detailed performance summary scorecard report")
    public ResponseEntity<ApiResponse<InterviewResultResponse>> getInterviewReport(
            Authentication authentication,
            @PathVariable("id") Long interviewId) {
        String email = authentication.getName();
        InterviewResultResponse report = interviewService.getInterviewReport(interviewId, email);
        return ResponseEntity.ok(ApiResponse.success("Performance scorecard report loaded", report));
    }
}
