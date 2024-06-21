package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.ResponseDTOs.NotificationResponse;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Notification;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/notify")
public class PushNotificationController {
    private final NotificationService notificationService;
    private final AccountService accountService;
    private final ModelMapper modelMapper;

    @GetMapping("/{accountID}")
    public Flux<ServerSentEvent<List<NotificationResponse>>> notify (@PathVariable("accountID") String accountID) {
        return notificationService.subscribeNotificationStream(accountService.findAccountById(accountID));
    }
}
