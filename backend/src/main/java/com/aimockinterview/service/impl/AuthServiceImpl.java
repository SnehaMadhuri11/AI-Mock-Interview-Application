package com.aimockinterview.service.impl;

import com.aimockinterview.dto.request.*;
import com.aimockinterview.dto.response.AuthResponse;
import com.aimockinterview.entity.Role;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.DuplicateEmailException;
import com.aimockinterview.exception.InvalidCredentialsException;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.mail.EmailService;
import com.aimockinterview.repository.UserRepository;
import com.aimockinterview.security.jwt.JwtTokenProvider;
import com.aimockinterview.service.AuthService;
import com.aimockinterview.service.OTPService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final OTPService otpService;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider,
                           OTPService otpService,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        log.info("Processing registration request for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} is already registered", request.getEmail());
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .active(true)
                .build();

        userRepository.save(user);
        log.info("User registered successfully with email: {}", request.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login attempt for email: {}", request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            String roleName = user.getRole().name().replace("ROLE_", "");

            log.info("User logged in successfully: {}", request.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .role(roleName)
                    .build();
        } catch (AuthenticationException ex) {
            log.warn("Login failed for email: {} - Reason: {}", request.getEmail(), ex.getMessage());
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Processing forgot password request for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        String otp = otpService.generateOTP(user.getEmail(), "PASSWORD_RESET");
        emailService.sendPasswordResetEmail(user.getEmail(), otp);

        log.info("Password reset OTP sent to email: {}", request.getEmail());
    }

    @Override
    public boolean verifyOtp(VerifyOtpRequest request) {
        log.info("Verifying OTP for email: {}, action: {}", request.getEmail(), request.getActionType());
        boolean isValid = otpService.verifyOTP(request.getEmail(), request.getOtpCode(), request.getActionType());
        if (isValid) {
            log.info("OTP verification successful for email: {}", request.getEmail());
        } else {
            log.warn("OTP verification failed for email: {}", request.getEmail());
        }
        return isValid;
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Processing password reset for email: {}", request.getEmail());

        boolean isOtpValid = otpService.verifyOTP(request.getEmail(), request.getOtpCode(), "PASSWORD_RESET");
        if (!isOtpValid) {
            log.warn("Password reset failed: Invalid or expired OTP for email {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password reset successful for email: {}", request.getEmail());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Processing refresh token request");

        if (jwtTokenProvider.validateToken(request.getRefreshToken())) {
            String username = jwtTokenProvider.getUsernameFromToken(request.getRefreshToken());

            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            if (!user.isActive()) {
                throw new InvalidCredentialsException("User account is deactivated");
            }

            String newAccessToken = jwtTokenProvider.generateTokenFromUsername(username, 3600000); // 1 hour
            String roleName = user.getRole().name().replace("ROLE_", "");

            log.info("Token refreshed successfully for user: {}", username);

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(request.getRefreshToken())
                    .role(roleName)
                    .build();
        } else {
            log.warn("Token refresh failed: Invalid refresh token");
            throw new InvalidCredentialsException("Invalid refresh token");
        }
    }

    @Override
    public void logout(String accessToken) {
        log.info("Logout requested for current user token");
        // Token discarding is handled client-side. Server logs the request.
    }
}
