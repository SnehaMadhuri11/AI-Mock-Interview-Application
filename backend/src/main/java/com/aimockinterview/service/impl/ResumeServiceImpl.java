package com.aimockinterview.service.impl;

import com.aimockinterview.ai.AIInterviewService;
import com.aimockinterview.dto.response.ResumeAnalysisResponse;
import com.aimockinterview.entity.ResumeAnalysis;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.ResumeProcessingException;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.repository.ResumeAnalysisRepository;
import com.aimockinterview.repository.UserRepository;
import com.aimockinterview.service.ResumeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@Slf4j
public class ResumeServiceImpl implements ResumeService {

    private final UserRepository userRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final AIInterviewService aiInterviewService;

    public ResumeServiceImpl(UserRepository userRepository,
                             ResumeAnalysisRepository resumeAnalysisRepository,
                             AIInterviewService aiInterviewService) {
        this.userRepository = userRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.aiInterviewService = aiInterviewService;
    }

    @Override
    @Transactional
    public ResumeAnalysisResponse uploadAndAnalyze(String userEmail, MultipartFile file) {
        log.info("Received resume upload request from user: {}", userEmail);

        if (file.isEmpty()) {
            throw new ResumeProcessingException("Uploaded file is empty");
        }

        if (!"application/pdf".equals(file.getContentType())) {
            throw new ResumeProcessingException("Only PDF resumes are supported");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        String extractedText;
        try {
            byte[] bytes = file.getBytes();
            try (PDDocument document = Loader.loadPDF(bytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                extractedText = stripper.getText(document);
            }
        } catch (IOException e) {
            log.error("Failed to parse PDF file using PDFBox: {}", e.getMessage(), e);
            throw new ResumeProcessingException("Failed to read and parse PDF resume", e);
        }

        if (extractedText == null || extractedText.trim().isEmpty()) {
            throw new ResumeProcessingException("No readable text found in the PDF resume");
        }

        log.info("Successfully extracted {} characters from resume. Initiating AI ATS evaluation...", extractedText.length());

        // Invoke AI to analyze resume text
        ResumeAnalysis analysis = aiInterviewService.analyzeResume(extractedText);
        analysis.setUser(user);

        ResumeAnalysis savedAnalysis = resumeAnalysisRepository.save(analysis);
        log.info("ATS evaluation complete. Score: {}", savedAnalysis.getAtsScore());

        return mapToResponse(savedAnalysis);
    }

    @Override
    public ResumeAnalysisResponse getLatestAnalysis(String userEmail) {
        log.info("Fetching latest resume analysis for user: {}", userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        return resumeAnalysisRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId())
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResumeProcessingException("No resume analysis found for this user"));
    }

    private ResumeAnalysisResponse mapToResponse(ResumeAnalysis analysis) {
        return ResumeAnalysisResponse.builder()
                .id(analysis.getId())
                .atsScore(analysis.getAtsScore())
                .extractedSkills(analysis.getExtractedSkills())
                .missingSkills(analysis.getMissingSkills())
                .recommendations(analysis.getRecommendations())
                .createdAt(analysis.getCreatedAt())
                .build();
    }
}
