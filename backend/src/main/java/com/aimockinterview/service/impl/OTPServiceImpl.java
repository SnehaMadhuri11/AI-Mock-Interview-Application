package com.aimockinterview.service.impl;

import com.aimockinterview.entity.OTPVerification;
import com.aimockinterview.repository.OTPVerificationRepository;
import com.aimockinterview.service.OTPService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OTPServiceImpl implements OTPService {

    private final OTPVerificationRepository otpRepository;
    private final SecureRandom secureRandom;

    public OTPServiceImpl(OTPVerificationRepository otpRepository) {
        this.otpRepository = otpRepository;
        this.secureRandom = new SecureRandom();
    }

    @Override
    @Transactional
    public String generateOTP(String email, String actionType) {
        // Delete any existing OTPs for the same action
        otpRepository.deleteByEmail(email);

        // Generate 6 digit OTP
        int number = secureRandom.nextInt(900000) + 100000;
        String otpCode = String.valueOf(number);

        // Expiration: 10 minutes (set in builder below)

        OTPVerification otpVerification = OTPVerification.builder()
                .email(email)
                .otpCode(otpCode)
                .actionType(actionType)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        otpRepository.save(otpVerification);
        return otpCode;
    }

    @Override
    @Transactional
    public boolean verifyOTP(String email, String otpCode, String actionType) {
        Optional<OTPVerification> optionalVerification = otpRepository
                .findTopByEmailAndActionTypeOrderByExpiresAtDesc(email, actionType);

        if (optionalVerification.isPresent()) {
            OTPVerification verification = optionalVerification.get();
            if (verification.getOtpCode().equals(otpCode) && !verification.isExpired()) {
                // Delete verification record to prevent reuse
                otpRepository.delete(verification);
                return true;
            }
        }
        return false;
    }
}
