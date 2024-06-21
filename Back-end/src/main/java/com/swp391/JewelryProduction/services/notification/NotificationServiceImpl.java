package com.swp391.JewelryProduction.services.notification;

import com.swp391.JewelryProduction.dto.ResponseDTOs.NotificationResponse;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import com.swp391.JewelryProduction.repositories.NotificationRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
//
//    private final ModelMapper modelMapper;
//    private final Flux<ServerSentEvent<Notification>> notificationFlux = Flux.push(this::generateNotifications);
//
//
//
//    private ServerSentEvent<Notification> generateNotification(AccountDTO account, Report report, Order order) {
//        Notification newNotification = Notification.builder()
//                .account(modelMapper.map(account, Account.class))
//                .report(report)
//                .order(order)
//                .build();
//
//        return ServerSentEvent.<Notification>builder()
//                .event(EVENT_NAME)
//                .data(newNotification)
//                .build();
//    }
//
//    private void generateNotifications(FluxSink<ServerSentEvent<Notification>> sink) {
//        Flux.interval(Duration.ofSeconds(2))
//                .map(i -> generateNotification())
//                .doOnNext(serverSentEvent -> {
//                    sink.next(serverSentEvent); // Sending notifications to the global Flux via its FluxSink
//                    log.info("Sent for {}", serverSentEvent.data().getId());
//                })
//                .doFinally(signalType -> log.info("Notification flux closed")) // Logging the closure of our generator
//                .takeWhile(notification -> !sink.isCancelled()) // We generate messages until the global Flux is closed
//                .subscribe();
//    }
//
//    private <T> Flux<ServerSentEvent<Notification>> keepAlive(Duration duration, Flux<T> data, String id) {
//        Flux<ServerSentEvent<T>> heartBeat = Flux.interval(duration)
//                .map(e -> ServerSentEvent.<T>builder()
//                    .comment("keep alive for: " + id)
//                    .build()
//                )
//                .doFinally(signalType -> log.info("Heartbeat closed for id: {}", id));
//        return Flux.<ServerSentEvent<Notification>>merge(heartBeat, data);
//    }
//
//    public Flux<ServerSentEvent<Notification>> subscribe(String id) {
//        return keepAlive(Duration.ofSeconds(3),
//                notificationFlux.filter(notification ->
//                        notification.data() == null ||
//                        notification.data().getAccount().getId().equals(id)),
//                id);
//    }
    //<editor-fold desc="MVC Service methods" defaultstate="collapsed">
    @Override
    public List<Notification> findAllByReceiver_Id(String receiverId) {
        return notificationRepository.findAllByReceiver_Id(receiverId);
    }

    @Override
    public Notification findById(UUID id) {
        if(notificationRepository.findById(id).isPresent()) {
            return notificationRepository.findById(id).get();
        } else return null;
    }

    @Override
    public void deleteNotification(UUID id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public Notification getNotificationById(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Notification id "+id+" not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotificationsByReceiverNotRead(Account receiver) {
        return notificationRepository.findAllByReceiverAndDeliveredFalse(receiver);
    }

    @Override
    public List<Notification> getAllNotificationsByReceiver(Account receiver) {
        return notificationRepository.findAllByReceiver(receiver);
    }

    @Override
    public Notification updateStatusToRead(UUID id) {
        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(NullPointerException::new);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void clearAllNotifications() {
        notificationRepository.deleteAll();
    }

    @Override
    public void clearAllNotificationsByReceiver(Account receiver) {
        notificationRepository.deleteAllByReceiver(receiver);
    }

    @Override
    public Notification createNotification(Notification notification, boolean isOption) {
        notification.setDelivered(false);
        notification.setRead(false);
        notification.setOption(isOption);
        return notificationRepository.save(notification);
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
        return NotificationResponse.builder()
                .id(notif.getId())
                .reportID(notif.getReport().getId())
                .reportTitle(notif.getReport().getTitle())
                .reportDescription(notif.getReport().getDescription())
                .reportCreatedDate(notif.getReport().getCreatedDate())
                .reportType(notif.getReport().getType())
                .reportSenderID(notif.getReport().getSender().getId())
                .orderID(notif.getOrder().getId())
                .receiverID(notif.getReceiver().getId())
                .delivered(true)
                .read(notif.isRead())
                .isOption(notif.isOption())
                .build();
    }
    //</editor-fold>
}
