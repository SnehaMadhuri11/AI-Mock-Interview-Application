package com.aimockinterview.service.impl;

import com.aimockinterview.ai.AIInterviewService;
import com.aimockinterview.dto.request.StartInterviewRequest;
import com.aimockinterview.dto.request.SubmitAnswerRequest;
import com.aimockinterview.dto.response.*;
import com.aimockinterview.entity.*;
import com.aimockinterview.exception.InterviewNotFoundException;
import com.aimockinterview.exception.InvalidCredentialsException;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.mail.EmailService;
import com.aimockinterview.repository.*;
import com.aimockinterview.service.InterviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class InterviewServiceImpl implements InterviewService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerSubmissionRepository answerSubmissionRepository;
    private final InterviewResultRepository interviewResultRepository;
    private final AIInterviewService aiInterviewService;
    private final EmailService emailService;

    public InterviewServiceImpl(UserRepository userRepository,
                                InterviewRepository interviewRepository,
                                QuestionRepository questionRepository,
                                AnswerSubmissionRepository answerSubmissionRepository,
                                InterviewResultRepository interviewResultRepository,
                                AIInterviewService aiInterviewService,
                                EmailService emailService) {
        this.userRepository = userRepository;
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerSubmissionRepository = answerSubmissionRepository;
        this.interviewResultRepository = interviewResultRepository;
        this.aiInterviewService = aiInterviewService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public List<QuestionResponse> startInterview(String userEmail, StartInterviewRequest request) {
        log.info("Starting mock interview for user: {}, category: {}", userEmail, request.getCategory());
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userEmail));

        Interview interview = Interview.builder()
                .user(user)
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .interviewType(request.getInterviewType())
                .score(0.0)
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Generate questions via AI
        List<Question> questions = aiInterviewService.generateQuestions(savedInterview);
        List<Question> savedQuestions = questionRepository.saveAll(questions);

        log.info("Successfully started interview ID #{} and generated {} questions", savedInterview.getId(), savedQuestions.size());

        return savedQuestions.stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .topic(q.getTopic())
                        .difficulty(q.getDifficulty())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EvaluationResponse submitAnswer(String userEmail, SubmitAnswerRequest request) {
        log.info("Submitting answer for question ID: {}", request.getQuestionId());

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new InterviewNotFoundException("Question not found with ID: " + request.getQuestionId()));

        // Check if user owns the interview
        if (!question.getInterview().getUser().getEmail().equals(userEmail)) {
            throw new InvalidCredentialsException("User does not have access to this interview question");
        }

        // Evaluate answer via AI
        AnswerSubmission evaluation = aiInterviewService.evaluateAnswer(question, request.getAnswer());

        // Save or update existing submission
        Optional<AnswerSubmission> existing = answerSubmissionRepository.findByQuestionId(request.getQuestionId());
        if (existing.isPresent()) {
            AnswerSubmission sub = existing.get();
            sub.setAnswer(request.getAnswer());
            sub.setTechnicalScore(evaluation.getTechnicalScore());
            sub.setCommunicationScore(evaluation.getCommunicationScore());
            sub.setClarityScore(evaluation.getClarityScore());
            sub.setCompletenessScore(evaluation.getCompletenessScore());
            sub.setFeedback(evaluation.getFeedback());
            sub.setSuggestions(evaluation.getSuggestions());
            answerSubmissionRepository.save(sub);
        } else {
            answerSubmissionRepository.save(evaluation);
        }

        log.info("Saved answer evaluation for question ID: {}", request.getQuestionId());

        return EvaluationResponse.builder()
                .questionId(request.getQuestionId())
                .answer(request.getAnswer())
                .technicalScore(evaluation.getTechnicalScore())
                .communicationScore(evaluation.getCommunicationScore())
                .clarityScore(evaluation.getClarityScore())
                .completenessScore(evaluation.getCompletenessScore())
                .feedback(evaluation.getFeedback())
                .suggestions(evaluation.getSuggestions())
                .build();
    }

    @Override
    @Transactional
    public InterviewResultResponse getInterviewResult(Long interviewId, String userEmail) {
        log.info("Fetching interview result for ID: {}", interviewId);

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new InterviewNotFoundException("Interview not found with ID: " + interviewId));

        if (!interview.getUser().getEmail().equals(userEmail)) {
            throw new InvalidCredentialsException("User does not have access to this interview result");
        }

        Optional<InterviewResult> optionalResult = interviewResultRepository.findByInterviewId(interviewId);
        if (optionalResult.isPresent()) {
            return mapResultToResponse(optionalResult.get());
        }

        // Generate on the fly
        List<AnswerSubmission> submissions = answerSubmissionRepository.findByQuestionInterviewId(interviewId);
        InterviewResult finalReport = aiInterviewService.generateFinalReport(interview, submissions);
        InterviewResult savedResult = interviewResultRepository.save(finalReport);

        // Update overall score in interview
        interview.setScore(savedResult.getOverallScore());
        interview.setFeedback(savedResult.getFeedback());
        interviewRepository.save(interview);

        // Send Email notification asynchronously/safely
        emailService.sendInterviewReportEmail(userEmail, savedResult);

        log.info("Compiled and generated final report for interview ID: {}", interviewId);
        return mapResultToResponse(savedResult);
    }

    @Override
    public Page<InterviewResponse> getInterviewHistory(String userEmail, Pageable pageable) {
        log.info("Fetching paginated interview history for user: {}", userEmail);
        return interviewRepository.findByUserId(
                userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new UserNotFoundException("User not found")).getId(),
                pageable
        ).map(i -> InterviewResponse.builder()
                .id(i.getId())
                .category(i.getCategory())
                .difficulty(i.getDifficulty())
                .interviewType(i.getInterviewType())
                .score(i.getScore())
                .feedback(i.getFeedback())
                .createdAt(i.getCreatedAt())
                .build());
    }

    @Override
    @Transactional
    public InterviewResultResponse getInterviewReport(Long interviewId, String userEmail) {
        return getInterviewResult(interviewId, userEmail);
    }

    private InterviewResultResponse mapResultToResponse(InterviewResult result) {
        return InterviewResultResponse.builder()
                .id(result.getId())
                .interviewId(result.getInterview().getId())
                .technicalScore(result.getTechnicalScore())
                .communicationScore(result.getCommunicationScore())
                .confidenceScore(result.getConfidenceScore())
                .overallScore(result.getOverallScore())
                .feedback(result.getFeedback())
                .strengths(result.getStrengths())
                .weaknesses(result.getWeaknesses())
                .build();
    }
}
