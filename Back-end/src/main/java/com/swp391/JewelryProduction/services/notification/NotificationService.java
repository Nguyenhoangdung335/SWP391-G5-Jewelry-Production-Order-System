package com.swp391.JewelryProduction.services.notification;

import com.swp391.JewelryProduction.dto.ResponseDTOs.NotificationResponse;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    Notification createNotification(Notification notification) throws MessagingException;
    Notification createNotification(Notification notification, boolean isOption) throws MessagingException;
    Notification createNotification(Notification notification, boolean isOption, boolean sendEmail) throws MessagingException;
    Notification getNotificationById(Integer id);
    List<Notification> getAllNotificationsByReceiverNotRead(Account receiver);
    List<Notification> getAllNotificationsByReceiver(Account receiver);
    void clearAllNotifications();
    void clearAllNotificationsByReceiver(Account receiver);


    Notification getFirstOptionNotificationInOrder(String orderId);

    Flux<ServerSentEvent<List<NotificationResponse>>> subscribeNotificationStream(Account receiver);

    void deleteNotification(Integer id);

    Page<Notification> findAllByReceiverId(String receiverId, int page, int size);
    Page<Notification> findAllByReceiverIdAndUnread (String receiverId, int page, int size);
}
