package com.aimockinterview.repository;

import com.aimockinterview.entity.InterviewResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewResultRepository extends JpaRepository<InterviewResult, Long> {
    Optional<InterviewResult> findByInterviewId(Long interviewId);
    List<InterviewResult> findByInterviewUserId(Long userId);
}
