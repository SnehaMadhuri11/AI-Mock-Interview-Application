package com.aimockinterview.controller;

import com.aimockinterview.dto.response.*;
import com.aimockinterview.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Portal", description = "Administrative endpoints for managing users, reviews, and system analytics (Admin role only)")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all registered users in the system")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users fetched successfully", users));
    }

    @GetMapping("/user/{id}")
    @Operation(summary = "Retrieve a user profile details by ID")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable("id") Long userId) {
        UserProfileResponse user = adminService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User profile loaded", user));
    }

    @PutMapping("/user/{id}/status")
    @Operation(summary = "Toggle user active status (block/unblock)")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(
            @PathVariable("id") Long userId,
            @RequestParam("active") boolean active) {
        UserProfileResponse updated = adminService.toggleUserStatus(userId, active);
        String message = active ? "User account unblocked" : "User account blocked";
        return ResponseEntity.ok(ApiResponse.success(message, updated));
    }

    @DeleteMapping("/user/{id}")
    @Operation(summary = "Permanently purge a user account from the system")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable("id") Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User account deleted successfully"));
    }

    @GetMapping("/interviews")
    @Operation(summary = "Audit list of all interviews completed across the platform")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getAllInterviews() {
        List<InterviewResponse> interviews = adminService.getAllInterviews();
        return ResponseEntity.ok(ApiResponse.success("All mock interviews fetched", interviews));
    }

    @GetMapping("/reports")
    @Operation(summary = "Audit list of all interview reports and panels feedback")
    public ResponseEntity<ApiResponse<List<InterviewResultResponse>>> getAllReports() {
        List<InterviewResultResponse> reports = adminService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("All report scorecards fetched", reports));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Retrieve global system statistics and analytics")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Administrative dashboard metrics loaded", stats));
    }
}
