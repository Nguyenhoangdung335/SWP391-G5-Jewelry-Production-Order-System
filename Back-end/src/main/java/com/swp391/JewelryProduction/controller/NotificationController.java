package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.pojos.Notification;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import com.swp391.JewelryProduction.services.report.ReportService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final ReportService reportService;

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<Response> getAllNotifications(
            @PathVariable("receiverId") String receiverId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Page<Notification> notificationPage = notificationService.findAllByReceiverId(receiverId, page, size);

        return Response.builder()
                .status(HttpStatus.OK)
                .message("Get notifications in page "+page+" successfully")
                .response("notifications", notificationPage.getContent())
                .response("totalPages", notificationPage.getTotalElements())
                .response("totalElements", notificationPage.getTotalElements())
                .buildEntity();
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<Response> getNotification(
            @PathVariable("notificationId") Integer notificationId
    ) {
        Notification notification = notificationService.getNotificationById(notificationId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Get notification with id "+notification.getId()+" successfully")
                .response("notification", notification)
                .buildEntity();
    }

    @GetMapping("/receiver/{receiverId}/unread")
    public ResponseEntity<Response> getUnreadNotifications (
            @PathVariable("receiverId") String receiverId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Page<Notification> notificationPage = notificationService.findAllByReceiverIdAndUnread(receiverId, page, size);

        return Response.builder()
                .status(HttpStatus.OK)
                .message("Get notifications in page "+page+" successfully")
                .response("notifications", notificationPage.getContent())
                .response("totalPages", notificationPage.getTotalElements())
                .response("totalElements", notificationPage.getTotalElements())
                .buildEntity();
    }

    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<Response> submitConfirmation(@RequestParam("confirmed") Boolean confirm, @PathVariable("orderId") String orderId ) throws Exception {
        reportService.handleUserResponse(orderId, confirm);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request send successfully")
                .buildEntity();
    }
}
