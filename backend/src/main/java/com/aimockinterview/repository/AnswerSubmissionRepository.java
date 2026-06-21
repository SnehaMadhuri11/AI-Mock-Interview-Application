package com.aimockinterview.repository;

import com.aimockinterview.entity.AnswerSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerSubmissionRepository extends JpaRepository<AnswerSubmission, Long> {
    List<AnswerSubmission> findByQuestionInterviewId(Long interviewId);
    Optional<AnswerSubmission> findByQuestionId(Long questionId);
}
