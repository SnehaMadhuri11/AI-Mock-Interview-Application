package com.aimockinterview.service.impl;

import com.aimockinterview.dto.response.DashboardStatsResponse;
import com.aimockinterview.entity.Interview;
import com.aimockinterview.entity.InterviewResult;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.repository.InterviewRepository;
import com.aimockinterview.repository.InterviewResultRepository;
import com.aimockinterview.repository.UserRepository;
import com.aimockinterview.service.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewResultRepository interviewResultRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                InterviewRepository interviewRepository,
                                InterviewResultRepository interviewResultRepository) {
        this.userRepository = userRepository;
        this.interviewRepository = interviewRepository;
        this.interviewResultRepository = interviewResultRepository;
    }

    @Override
    public DashboardStatsResponse getDashboardStats(String userEmail) {
        log.info("Generating dashboard statistics for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        long totalInterviews = interviews.size();

        double averageScore = 0.0;
        double bestScore = 0.0;
        Set<String> strongAreasSet = new LinkedHashSet<>();
        Set<String> weakAreasSet = new LinkedHashSet<>();

        if (totalInterviews > 0) {
            averageScore = interviews.stream()
                    .mapToDouble(Interview::getScore)
                    .average()
                    .orElse(0.0);

            bestScore = interviews.stream()
                    .mapToDouble(Interview::getScore)
                    .max()
                    .orElse(0.0);

            // Fetch interview results to parse strengths and weaknesses
            List<InterviewResult> results = interviewResultRepository.findByInterviewUserId(user.getId());

            for (InterviewResult res : results) {
                if (res.getStrengths() != null && !res.getStrengths().trim().isEmpty()) {
                    Arrays.stream(res.getStrengths().split("[,;.]"))
                            .map(String::trim)
                            .filter(s -> s.length() > 3)
                            .forEach(strongAreasSet::add);
                }
                if (res.getWeaknesses() != null && !res.getWeaknesses().trim().isEmpty()) {
                    Arrays.stream(res.getWeaknesses().split("[,;.]"))
                            .map(String::trim)
                            .filter(s -> s.length() > 3)
                            .forEach(weakAreasSet::add);
                }
            }
        }

        // Limit lists to maximum of 4 elements for clean layout
        List<String> strongAreas = strongAreasSet.stream().limit(4).collect(Collectors.toList());
        List<String> weakAreas = weakAreasSet.stream().limit(4).collect(Collectors.toList());

        // Default placeholders if data is insufficient
        if (strongAreas.isEmpty()) {
            strongAreas = List.of("Topic understanding", "Conceptual clarity");
        }
        if (weakAreas.isEmpty()) {
            weakAreas = List.of("Speed", "Detailed explanations");
        }

        log.info("Dashboard stats loaded. Total interviews: {}", totalInterviews);

        return DashboardStatsResponse.builder()
                .totalInterviews(totalInterviews)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .bestScore(Math.round(bestScore * 10.0) / 10.0)
                .strongAreas(strongAreas)
                .weakAreas(weakAreas)
                .build();
    }
}
