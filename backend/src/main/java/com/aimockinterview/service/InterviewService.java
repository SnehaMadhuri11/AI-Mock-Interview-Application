package com.aimockinterview.service;

import com.aimockinterview.dto.request.StartInterviewRequest;
import com.aimockinterview.dto.request.SubmitAnswerRequest;
import com.aimockinterview.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface InterviewService {

    List<QuestionResponse> startInterview(String userEmail, StartInterviewRequest request);

    EvaluationResponse submitAnswer(String userEmail, SubmitAnswerRequest request);

    InterviewResultResponse getInterviewResult(Long interviewId, String userEmail);

    Page<InterviewResponse> getInterviewHistory(String userEmail, Pageable pageable);

    InterviewResultResponse getInterviewReport(Long interviewId, String userEmail);
}
