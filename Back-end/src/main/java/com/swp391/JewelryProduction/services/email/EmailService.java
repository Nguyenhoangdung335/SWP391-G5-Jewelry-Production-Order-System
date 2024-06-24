package com.swp391.JewelryProduction.services.email;

import com.swp391.JewelryProduction.pojos.Notification;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendLinkEmail(String toEmail, String subject, String header, String formerContent, String message, String redirectLink, String latterContent) throws MessagingException;
    void sendOtpTextEmail(String toEmail, String otpCode) throws MessagingException;

    void sendMailFromNotification (Notification notification) throws MessagingException;
}
