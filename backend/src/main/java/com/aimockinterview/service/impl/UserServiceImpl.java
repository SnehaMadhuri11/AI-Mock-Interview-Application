package com.aimockinterview.service.impl;

import com.aimockinterview.dto.request.UserProfileRequest;
import com.aimockinterview.dto.response.UserProfileResponse;
import com.aimockinterview.entity.User;
import com.aimockinterview.exception.UserNotFoundException;
import com.aimockinterview.repository.UserRepository;
import com.aimockinterview.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserProfileResponse getProfile(String email) {
        log.info("Fetching user profile for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        log.info("Updating user profile for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        log.info("User profile updated successfully for email: {}", email);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteAccount(String email) {
        log.info("Purging user account for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        userRepository.delete(user);
        log.info("User account successfully purged for email: {}", email);
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name().replace("ROLE_", ""))
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
