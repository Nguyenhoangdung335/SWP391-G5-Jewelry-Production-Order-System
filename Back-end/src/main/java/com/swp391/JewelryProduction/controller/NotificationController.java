package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.report.ReportService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController {
    private final NotificationService notificationService;
    private final ReportService reportService;
    private final AccountService accountService;
    private final OrderService orderService;

    @GetMapping("/{accountId}/get-all")
    public ResponseEntity<Response> getAllNotifications(@PathVariable("accountId") String receiverId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request send successfully.")
                .response("notification-list", notificationService.findAllByReceiver_Id(receiverId))
                .buildEntity();
    }

//    @PostMapping("/create")
//    public ResponseEntity<Response> createNotification (@RequestBody NotificationRequest request) {
//        Order order = orderService.saveNewOrder(request.getReceiverID());
//
//        log.info("Order: " + order.toString());
//
//        Report report = Report.builder()
//                .title(request.getReportTitle())
//                .description(request.getReportDescription())
//                .type(request.getReportType())
//                .sender(accountService.findAccountById(request.getSenderID()))
//                .createdDate(LocalDateTime.now())
//                .build();
//        Notification notification = Notification.builder()
//                .receiver(accountService.findAccountById(request.getReceiverID()))
//                .read(request.isRead())
//                .delivered(request.isDelivered())
//                .isOption(request.isOption())
//                .report(report)
//                .order(order)
//                .build();
//
//        report.getNotifications().add(notification);
//        report.setReportingOrder(order);
//        order.setRelatedReports(Collections.singletonList(report));
//        order.setNotifications(Collections.singletonList(notification));
//
//        report = reportService.saveReport(report);
//        log.info("Report successfully saved "+report.getId());
//        order = orderService.updateOrder(order);
//        log.info("Order successfully saved "+order.getId());
//        notification = notificationService.createNotification(notification, false);
//        log.info("Notification successfully saved "+notification.getId());
//
//        return Response.builder()
//                .status(HttpStatus.OK)
//                .message("Notification saved successfully")
//                .response("notification-list", notification)
//                .buildEntity();
//    }

//    @PatchMapping("/read/{notificationID}")
//    public ResponseEntity<Response> changeStatusToRead (@PathVariable("notificationID") UUID notificationID) {
//        return Response.builder()
//                .message("Notification change status to read")
//                .response(String.valueOf(notificationID), notificationService.updateStatusToRead(notificationID))
//                .buildEntity();
//    }

    @GetMapping("/get/{notificationId}")
    public ResponseEntity<Response> getNotification(@PathVariable("notificationId") UUID notificationId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request send successfully")
                .response("notification", notificationService.getNotificationById(notificationId))
                .buildEntity();
    }

//    @PostMapping("/{orderId}/confirm")
//    public ResponseEntity<Response> submitConfirmation(@RequestParam("comfirmed") ConfirmedState confirm, @PathVariable("orderId") String orderId ) throws Exception {
//        reportService.handleUserResponse(orderId, confirm);
//        return Response.builder()
//                .status(HttpStatus.OK)
//                .message("Request send successfully")
//                .buildEntity();
//    }
}
