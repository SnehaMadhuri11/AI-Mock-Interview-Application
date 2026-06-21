package com.aimockinterview.service.impl;

import com.aimockinterview.ai.AIInterviewService;
import com.aimockinterview.dto.response.CareerRecommendationsResponse;
import com.aimockinterview.entity.Interview;
import com.aimockinterview.entity.ResumeAnalysis;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.repository.InterviewRepository;
import com.aimockinterview.repository.ResumeAnalysisRepository;
import com.aimockinterview.repository.UserRepository;
import com.aimockinterview.service.CareerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CareerServiceImpl implements CareerService {

    private final UserRepository userRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final InterviewRepository interviewRepository;
    private final AIInterviewService aiInterviewService;

    public CareerServiceImpl(UserRepository userRepository,
                             ResumeAnalysisRepository resumeAnalysisRepository,
                             InterviewRepository interviewRepository,
                             AIInterviewService aiInterviewService) {
        this.userRepository = userRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.interviewRepository = interviewRepository;
        this.aiInterviewService = aiInterviewService;
    }

    @Override
    public CareerRecommendationsResponse getRecommendations(String userEmail) {
        log.info("Generating career recommendations for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        // Get latest resume skills
        Optional<ResumeAnalysis> latestResume = resumeAnalysisRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId());
        String skills = latestResume.map(ResumeAnalysis::getExtractedSkills).orElse("No skills extracted yet (Please upload a resume first)");

        // Get interview history stats
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        double averageScore = 0.0;
        String performanceSummary = "No interviews taken yet";

        if (!interviews.isEmpty()) {
            double totalScore = interviews.stream().mapToDouble(Interview::getScore).sum();
            averageScore = totalScore / interviews.size();

            performanceSummary = interviews.stream().limit(5)
                    .map(i -> String.format("%s (%s, Score: %.1f%%)", i.getCategory(), i.getInterviewType(), i.getScore()))
                    .collect(Collectors.joining(", "));
        }

        log.info("Invoking AI recommendations. Avg Score: {}, Summary: {}", averageScore, performanceSummary);

        return aiInterviewService.generateCareerRecommendations(skills, averageScore, performanceSummary);
    }
}
