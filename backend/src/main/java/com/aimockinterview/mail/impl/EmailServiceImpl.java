package com.aimockinterview.mail.impl;

import com.aimockinterview.entity.InterviewResult;
import com.aimockinterview.entity.User;
import com.aimockinterview.mail.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOTPEmail(String toEmail, String otpCode) {
        log.info("Preparing OTP Email for {}", toEmail);
        String subject = "Verify Your Account - AI Mock Interview Application";
        String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;'>" +
                "  <h2 style='color: #4A90E2;'>Account Verification</h2>" +
                "  <p>Thank you for registering. Please use the following One-Time Password (OTP) to complete your registration:</p>" +
                "  <div style='background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;'>%s</div>" +
                "  <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>" +
                "  <br/>" +
                "  <p>Best regards,<br/>The AI Mock Interview Team</p>" +
                "</div>",
                otpCode
        );
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String otpCode) {
        log.info("Preparing Password Reset Email for {}", toEmail);
        String subject = "Reset Your Password - AI Mock Interview Application";
        String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;'>" +
                "  <h2 style='color: #E24A4A;'>Password Reset Request</h2>" +
                "  <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>" +
                "  <div style='background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;'>%s</div>" +
                "  <p>This OTP is valid for 10 minutes. If you did not make this request, please change your password immediately.</p>" +
                "  <br/>" +
                "  <p>Best regards,<br/>The AI Mock Interview Team</p>" +
                "</div>",
                otpCode
        );
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendInterviewReportEmail(String toEmail, InterviewResult result) {
        log.info("Preparing Interview Report Email for {}", toEmail);
        String subject = "Your AI Interview Evaluation Report - ID #" + result.getInterview().getId();
        String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;'>" +
                "  <h2 style='color: #2ECC71;'>Interview Evaluation Summary</h2>" +
                "  <p>Congratulations on completing your mock interview for <strong>%s (%s - %s)</strong>!</p>" +
                "  <table style='width: 100%%; border-collapse: collapse; margin-top: 15px;'>" +
                "    <tr style='background-color: #f8f9fa;'>" +
                "      <th style='padding: 8px; border: 1px solid #ddd; text-align: left;'>Score Metric</th>" +
                "      <th style='padding: 8px; border: 1px solid #ddd; text-align: right;'>Score Value</th>" +
                "    </tr>" +
                "    <tr>" +
                "      <td style='padding: 8px; border: 1px solid #ddd;'>Technical Accuracy</td>" +
                "      <td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>%.1f%%</td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td style='padding: 8px; border: 1px solid #ddd;'>Communication Skill</td>" +
                "      <td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>%.1f%%</td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td style='padding: 8px; border: 1px solid #ddd;'>Confidence Level</td>" +
                "      <td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>%.1f%%</td>" +
                "    </tr>" +
                "    <tr style='font-weight: bold; background-color: #eafaf1;'>" +
                "      <td style='padding: 8px; border: 1px solid #ddd;'>Overall Aggregate Score</td>" +
                "      <td style='padding: 8px; border: 1px solid #ddd; text-align: right; color: #27ae60;'>%.1f%%</td>" +
                "    </tr>" +
                "  </table>" +
                "  <h4 style='color: #333; margin-top: 20px;'>Aggregate Panel Feedback:</h4>" +
                "  <p style='background-color: #f9f9f9; padding: 10px; border-left: 4px solid #2ECC71;'>%s</p>" +
                "  <h4 style='color: #27ae60;'>Key Strengths:</h4>" +
                "  <p>%s</p>" +
                "  <h4 style='color: #c0392b;'>Areas of Improvement:</h4>" +
                "  <p>%s</p>" +
                "  <p>To view detailed question-by-question evaluations, please log in to your dashboard.</p>" +
                "  <br/>" +
                "  <p>Keep practicing!<br/>The AI Mock Interview Team</p>" +
                "</div>",
                result.getInterview().getCategory(), result.getInterview().getInterviewType(), result.getInterview().getDifficulty(),
                result.getTechnicalScore(), result.getCommunicationScore(), result.getConfidenceScore(), result.getOverallScore(),
                result.getFeedback(), result.getStrengths(), result.getWeaknesses()
        );
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendWeeklyProgressReportEmail(User user, long interviewCount, double averageScore) {
        log.info("Preparing Weekly Progress Email for {}", user.getEmail());
        String subject = "Your Weekly Career Progress Report";
        String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;'>" +
                "  <h2 style='color: #34495E;'>Weekly Mock Interview Insights</h2>" +
                "  <p>Hello %s,</p>" +
                "  <p>Here is a summary of your performance and active engagement during the past week:</p>" +
                "  <ul>" +
                "    <li>Mock Interviews Attempted: <strong>%d</strong></li>" +
                "    <li>Average Mock Score: <strong>%.1f%%</strong></li>" +
                "  </ul>" +
                "  <p>Consistent mock practice is the key to cracking real technical rounds. Try to schedule and finish at least 3 mock sessions next week to target your weaknesses!</p>" +
                "  <br/>" +
                "  <p>Best regards,<br/>The AI Mock Interview Team</p>" +
                "</div>",
                user.getFullName(), interviewCount, averageScore
        );
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Successfully sent email to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {} due to: {}. Logging email content instead.", toEmail, e.getMessage());
            log.info("================ FALLBACK EMAIL CONTENT ================");
            log.info("To: {}", toEmail);
            log.info("Subject: {}", subject);
            log.info("Content:\n{}", htmlContent);
            log.info("=========================================================");
        }
    }
}
