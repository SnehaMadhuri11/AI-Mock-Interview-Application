package com.aimockinterview.service;

import com.aimockinterview.dto.response.*;
import java.util.List;

public interface AdminService {

    List<UserProfileResponse> getAllUsers();

    UserProfileResponse getUserById(Long userId);

    UserProfileResponse toggleUserStatus(Long userId, boolean active);

    void deleteUser(Long userId);

    List<InterviewResponse> getAllInterviews();

    List<InterviewResultResponse> getAllReports();

    AdminDashboardResponse getAdminDashboardStats();
}
