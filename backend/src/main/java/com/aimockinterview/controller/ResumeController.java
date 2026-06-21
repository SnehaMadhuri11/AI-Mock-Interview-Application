package com.aimockinterview.controller;

import com.aimockinterview.dto.response.ApiResponse;
import com.aimockinterview.dto.response.ResumeAnalysisResponse;
import com.aimockinterview.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "Resume Analyzer", description = "Endpoints for uploading and analyzing PDF resumes using ATS keyword scoring")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a PDF resume for text extraction and ATS match auditing")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String email = authentication.getName();
        ResumeAnalysisResponse analysis = resumeService.uploadAndAnalyze(email, file);
        return ResponseEntity.ok(ApiResponse.success("Resume parsed and analyzed successfully", analysis));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get the candidate's latest resume analysis metrics")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> getLatestAnalysis(Authentication authentication) {
        String email = authentication.getName();
        ResumeAnalysisResponse analysis = resumeService.getLatestAnalysis(email);
        return ResponseEntity.ok(ApiResponse.success("Latest resume analysis loaded", analysis));
    }
}
