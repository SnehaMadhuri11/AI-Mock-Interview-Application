package com.aimockinterview.repository;

import com.aimockinterview.entity.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {
    Optional<OTPVerification> findTopByEmailAndActionTypeOrderByExpiresAtDesc(String email, String actionType);
    void deleteByEmail(String email);
}
