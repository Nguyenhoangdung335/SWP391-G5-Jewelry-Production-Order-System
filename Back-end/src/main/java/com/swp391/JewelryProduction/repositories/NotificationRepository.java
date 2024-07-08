package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByReceiverAndDeliveredFalse (Account receiver);
    List<Notification> findAllByReceiver (Account receiver);
    List<Notification> findAllByReceiverId (String receiverId);
    void deleteAllByReceiver (Account receiver);
}
