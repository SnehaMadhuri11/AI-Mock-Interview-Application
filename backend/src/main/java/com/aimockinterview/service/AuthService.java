package com.aimockinterview.service;

import com.aimockinterview.dto.request.*;
import com.aimockinterview.dto.response.AuthResponse;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    boolean verifyOtp(VerifyOtpRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String accessToken);
}
