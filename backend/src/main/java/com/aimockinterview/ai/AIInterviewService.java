package com.aimockinterview.ai;

import com.aimockinterview.dto.response.CareerRecommendationsResponse;
import com.aimockinterview.entity.AnswerSubmission;
import com.aimockinterview.entity.Interview;
import com.aimockinterview.entity.InterviewResult;
import com.aimockinterview.entity.Question;
import com.aimockinterview.entity.ResumeAnalysis;
import java.util.List;

public interface AIInterviewService {

    List<Question> generateQuestions(Interview interview);

    AnswerSubmission evaluateAnswer(Question question, String answer);

    InterviewResult generateFinalReport(Interview interview, List<AnswerSubmission> submissions);

    ResumeAnalysis analyzeResume(String resumeText);

    CareerRecommendationsResponse generateCareerRecommendations(String skills, double averageScore, String performanceHistory);

    String askChatbot(String question);
}
