package com.aimockinterview.controller;

import com.aimockinterview.dto.request.UserProfileRequest;
import com.aimockinterview.dto.response.ApiResponse;
import com.aimockinterview.dto.response.UserProfileResponse;
import com.aimockinterview.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Profile", description = "Endpoints for managing candidate profile information")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Retrieve current user profile details")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileResponse profile = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile details")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileRequest request) {
        String email = authentication.getName();
        UserProfileResponse updated = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @DeleteMapping("/account")
    @Operation(summary = "Permanently delete current user account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteAccount(email);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully"));
    }
}
