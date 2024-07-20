package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    @EntityGraph(attributePaths = {"report.sender"})
    List<Notification> findAllByReceiverAndDeliveredFalse (Account receiver);
    @EntityGraph(attributePaths = {"report.sender"})
    List<Notification> findAllByReceiver (Account receiver);
    @EntityGraph(attributePaths = {"report.sender"})
    List<Notification> findAllByReceiverId (String receiverId);

    @EntityGraph(attributePaths = {"report.sender"})
    Page<Notification> findAllByReceiverId (String receiverId, PageRequest pageRequest);
    @EntityGraph(attributePaths = {"report.sender"})
    Page<Notification> findALlByReceiverIdAndDeliveredFalse (String receiverId, PageRequest pageRequest);
    @EntityGraph(attributePaths = {"report.sender"})
    Page<Notification> findAllByReceiverIdAndReadFalse (String receiverId, PageRequest pageRequest);

    @EntityGraph(attributePaths = {"report.sender.userInfo"})
    @NotNull
    @Override
    Optional<Notification> findById(@NotNull Integer integer);

    Optional<Notification> findFirstByOrderIdAndOptionIsTrue(String orderId);

    void deleteAllByReceiver (Account receiver);
}
