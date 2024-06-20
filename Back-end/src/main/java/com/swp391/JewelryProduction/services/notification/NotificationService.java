package com.swp391.JewelryProduction.services.notification;

import com.swp391.JewelryProduction.dto.ResponseDTOs.NotificationResponse;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
//    Flux<ServerSentEvent<Notification>> subscribe(String accountID);
    Notification createNotification(Notification notification, boolean isOption);
    Notification getNotificationById(UUID id);
    List<Notification> getAllNotificationsByReceiverNotRead(Account receiver);
    List<Notification> getAllNotificationsByReceiver(Account receiver);
    Notification updateStatusToRead (UUID id);
    void clearAllNotifications();
    void clearAllNotificationsByReceiver(Account receiver);


    Flux<ServerSentEvent<List<NotificationResponse>>> subscribeNotificationStream(Account receiver);
    List<Notification> findAllByReceiver_Id(String receiverId);
    Notification findById(UUID id);
    void deleteNotification(UUID id);

}
