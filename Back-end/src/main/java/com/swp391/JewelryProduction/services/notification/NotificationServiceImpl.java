package com.swp391.JewelryProduction.services.notification;

import com.swp391.JewelryProduction.dto.ResponseDTOs.NotificationResponse;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import com.swp391.JewelryProduction.pojos.Report;
import com.swp391.JewelryProduction.repositories.NotificationRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.email.EmailService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    private final AccountService accountService;
    private final EmailService emailService;

    //<editor-fold desc="MVC Service methods" defaultstate="collapsed">
    @Override
    public Page<Notification> findAllByReceiverId(String receiverId, int page, int size) {
        return notificationRepository.findAllByReceiverId(receiverId,
                PageRequest.of(page, size,
                        Sort.by("read").ascending()
                                .and(Sort.by("report.createdDate").descending()))
        );
    }

    @Override
    public Page<Notification> findAllByReceiverIdAndUnread(String receiverId, int page, int size) {
        return notificationRepository.findAllByReceiverIdAndReadFalse(receiverId,
                PageRequest.of(page, size,
                        Sort.by("report.createdDate").descending())
        );
    }

    @Override
    public void deleteNotification(Integer id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public Notification getNotificationById(Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Notification id "+id+" not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void clearAllNotifications() {
        notificationRepository.deleteAll();
    }

    @Override
    public void clearAllNotificationsByReceiver(Account receiver) {
        receiver.setNotifications(null);
        receiver = accountService.updateAccount(receiver);
        notificationRepository.deleteAllByReceiverId(receiver.getId());
    }

    @Override
    public Notification createNotification(Notification notification) throws MessagingException {
        return this.createNotification(notification, false);
    }

    @Override
    public Notification createNotification(Notification notification, boolean isOption) throws MessagingException {
        return this.createNotification(notification, isOption, false);
    }

    @Override
    public Notification createNotification(Notification notification, boolean isOption, boolean sendEmail) throws MessagingException {
        notification.setDelivered(false);
        notification.setRead(false);
        notification.setOption(isOption);
        notification = notificationRepository.save(notification);
        if (sendEmail)
            emailService.sendMailFromNotification(notification);
        return notification;
    }

    @Override
    public Notification getFirstOptionNotificationInOrder(String orderId) {
        return notificationRepository.findFirstByOrderIdAndOptionIsTrue(orderId).orElse(null);
    }

    //</editor-fold>

    //<editor-fold desc="WebFlux Service methods" defaultstate="collapsed">
    @Override
    public Flux<ServerSentEvent<List<NotificationResponse>>> subscribeNotificationStream(Account receiver) {
        return Flux.merge(Flux.interval(Duration.ofSeconds(3))
                .publishOn(Schedulers.boundedElastic())
                .map(sequence -> ServerSentEvent.<List<NotificationResponse>>builder()
                        .id(String.valueOf(sequence))
                        .event("notify")
                        .data(getNotifications(receiver))
                        .build()
                ), Flux.interval(Duration.ofSeconds(3))
                .map(sequence -> ServerSentEvent.<List<NotificationResponse>>builder()
                        .event("heartbeat")
                        .build()));
    }

    private List<NotificationResponse> getNotifications(Account receiver) {
        List<NotificationResponse> list = new ArrayList<>();
        List<Notification> notifications = notificationRepository
                .findAllByReceiverAndDeliveredFalse(receiver);

        notifications.forEach(notification -> {
            notification.setDelivered(true);
            list.add(mappedToResponse(notification));
        });

        notificationRepository.saveAll(notifications);
        return list;
    }

    private NotificationResponse mappedToResponse(Notification notif) {
        Report relatedReport = notif.getReport();

        return NotificationResponse.builder()
                .id(notif.getId())
                .reportID(relatedReport.getId())
                .reportTitle(relatedReport.getTitle())
                .reportDescription(relatedReport.getDescription())
                .reportCreatedDate(relatedReport.getCreatedDate())
                .reportType(relatedReport.getType())
                .reportSenderID((relatedReport.getSender() == null)?
                        "":
                        relatedReport.getSender().getId())
                .orderID(notif.getOrder().getId())
                .receiverID(notif.getReceiver().getId())
                .delivered(true)
                .read(notif.isRead())
                .isOption(notif.isOption())
                .build();
    }
    //</editor-fold>
}
