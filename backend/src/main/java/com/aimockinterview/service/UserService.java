package com.aimockinterview.service;

import com.aimockinterview.dto.request.UserProfileRequest;
import com.aimockinterview.dto.response.UserProfileResponse;

public interface UserService {

    UserProfileResponse getProfile(String email);

    UserProfileResponse updateProfile(String email, UserProfileRequest request);

    void deleteAccount(String email);
}
