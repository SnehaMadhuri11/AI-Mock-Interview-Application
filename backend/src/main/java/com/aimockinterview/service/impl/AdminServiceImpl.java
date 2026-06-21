package com.aimockinterview.service.impl;

import com.aimockinterview.dto.response.*;
import com.aimockinterview.entity.Interview;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.repository.*;
import com.aimockinterview.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewResultRepository interviewResultRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            InterviewRepository interviewRepository,
                            InterviewResultRepository interviewResultRepository,
                            ResumeAnalysisRepository resumeAnalysisRepository) {
        this.userRepository = userRepository;
        this.interviewRepository = interviewRepository;
        this.interviewResultRepository = interviewResultRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        log.info("Admin query: fetching all users");
        return userRepository.findAll().stream()
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserProfileResponse getUserById(Long userId) {
        log.info("Admin query: fetching user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        return mapUserToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId, boolean active) {
        log.info("Admin command: toggling active status of user ID: {} to {}", userId, active);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        user.setActive(active);
        User updated = userRepository.save(user);
        return mapUserToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        log.info("Admin command: deleting user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        userRepository.delete(user);
        log.info("Admin command successful: user ID: {} has been purged", userId);
    }

    @Override
    public List<InterviewResponse> getAllInterviews() {
        log.info("Admin query: fetching all interviews");
        return interviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(i -> InterviewResponse.builder()
                        .id(i.getId())
                        .category(i.getCategory())
                        .difficulty(i.getDifficulty())
                        .interviewType(i.getInterviewType())
                        .score(i.getScore())
                        .feedback(i.getFeedback())
                        .createdAt(i.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<InterviewResultResponse> getAllReports() {
        log.info("Admin query: fetching all reports");
        return interviewResultRepository.findAll().stream()
                .map(r -> InterviewResultResponse.builder()
                        .id(r.getId())
                        .interviewId(r.getInterview().getId())
                        .technicalScore(r.getTechnicalScore())
                        .communicationScore(r.getCommunicationScore())
                        .confidenceScore(r.getConfidenceScore())
                        .overallScore(r.getOverallScore())
                        .feedback(r.getFeedback())
                        .strengths(r.getStrengths())
                        .weaknesses(r.getWeaknesses())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public AdminDashboardResponse getAdminDashboardStats() {
        log.info("Admin query: generating system dashboard statistics");

        long totalUsers = userRepository.count();
        long totalInterviews = interviewRepository.count();
        long totalResumeAnalyses = resumeAnalysisRepository.count();
        long activeUsersCount = userRepository.findAll().stream().filter(User::isActive).count();

        double averageInterviewScore = interviewRepository.findAll().stream()
                .mapToDouble(Interview::getScore)
                .average()
                .orElse(0.0);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalInterviews(totalInterviews)
                .totalResumeAnalyses(totalResumeAnalyses)
                .activeUsersCount(activeUsersCount)
                .averageInterviewScore(Math.round(averageInterviewScore * 10.0) / 10.0)
                .build();
    }

    private UserProfileResponse mapUserToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name().replace("ROLE_", ""))
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
