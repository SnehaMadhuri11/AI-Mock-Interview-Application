package com.aimockinterview.repository;

import com.aimockinterview.entity.Interview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Interview> findByUserId(Long userId, Pageable pageable);
    long countByUserId(Long userId);
    List<Interview> findAllByOrderByCreatedAtDesc();
}
