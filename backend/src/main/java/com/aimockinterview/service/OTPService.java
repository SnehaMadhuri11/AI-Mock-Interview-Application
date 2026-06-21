package com.aimockinterview.service;

public interface OTPService {

    String generateOTP(String email, String actionType);

    boolean verifyOTP(String email, String otpCode, String actionType);
}
