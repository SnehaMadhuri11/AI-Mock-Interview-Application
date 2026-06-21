package com.aimockinterview.service;

import com.aimockinterview.dto.response.ResumeAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    ResumeAnalysisResponse uploadAndAnalyze(String userEmail, MultipartFile file);

    ResumeAnalysisResponse getLatestAnalysis(String userEmail);
}
