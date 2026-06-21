package com.aimockinterview.repository;

import com.aimockinterview.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ResumeAnalysis> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
