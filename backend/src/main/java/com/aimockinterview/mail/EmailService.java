package com.aimockinterview.mail;

import com.aimockinterview.entity.InterviewResult;
import com.aimockinterview.entity.User;

public interface EmailService {

    void sendOTPEmail(String toEmail, String otpCode);

    void sendPasswordResetEmail(String toEmail, String otpCode);

    void sendInterviewReportEmail(String toEmail, InterviewResult result);

    void sendWeeklyProgressReportEmail(User user, long interviewCount, double averageScore);
}
