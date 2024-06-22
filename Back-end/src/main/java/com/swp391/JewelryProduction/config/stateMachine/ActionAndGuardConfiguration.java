package com.swp391.JewelryProduction.config.stateMachine;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.ReportType;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.report.ReportService;
import com.swp391.JewelryProduction.util.MessagesConstant;
import com.swp391.JewelryProduction.util.exceptions.MissingContextVariableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.action.Action;
import org.springframework.statemachine.guard.Guard;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

import static com.swp391.JewelryProduction.util.StateMachineUtil.getCurrentState;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ActionAndGuardConfiguration implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    private final MessagesConstant messagesConstant = new MessagesConstant();

    @Override
    public void setApplicationContext(@NotNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    //<editor-fold desc="GUARD BEAN" defaultstate="collapsed">
    @Bean
    public Guard<OrderStatus, OrderEvent> checkApprovalGuard() {
        return context -> {
            Boolean approved = context.getExtendedState().get("isApproved", Boolean.class);
            return approved != null && approved;
        };
    }

    @Bean
    public Guard<OrderStatus, OrderEvent> checkTransactionGuard () {
        return context -> {
            Boolean successful = context.getExtendedState().get("isSuccessful", Boolean.class);
            return successful != null && successful;
        };
    }
    //</editor-fold>

    //<editor-fold desc="ACTION BEAN" defaultstate="collapsed">
    @Bean
    public Action<OrderStatus, OrderEvent> notifyManagerApprovalAction() {
        return context -> {
            log.info("\tnotifyManagerApprovalAction is called\t\n");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            AccountService accountService = applicationContext.getBean(AccountService.class);

            String orderID = context.getExtendedState().get("orderID", String.class);
            Integer reportID = context.getExtendedState().get("reportID", Integer.class);

            if (orderID == null) {
                String errorMsg = String.format("orderID is missing, state: %s", context.getSource());
                log.error(errorMsg);
                throw new MissingContextVariableException(errorMsg);
            } else if (reportID == null) {
                String errorMsg = String.format("reportID is missing, state: %s", context.getSource());
                log.error(errorMsg);
                throw new MissingContextVariableException(errorMsg);
            }

            Order order = orderService.findOrderById(orderID);
            Report report = reportService.findReportByID(reportID);

            List<Account> managers = accountService
                    .findAllByRole(Role.MANAGER)
                    .stream()
                    .toList();

            managers.forEach(manager -> {
                Notification notification = Notification.builder()
                                .receiver(manager)
                                .report(report)
                                .order(order)
                                .build();
                report.getNotifications().add(notification);
                order.getNotifications().add(notification);
                notification = notificationService.createNotification(notification, true);
                log.info("Notification with id {} of order id {} sent to user {} of role {}",
                        notification.getId(), order.getId(), manager.getId(), manager.getRole()
                );
            });
//            reportService.updateReport(report);
//            orderService.updateOrder(order);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCustomerApprovalAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            Report report = reportService.findReportByID(context.getExtendedState().get("reportID", Integer.class));
            Account owner = order.getOwner();

            Notification notification = notificationService.createNotification(Notification.builder()
                            .receiver(owner)
                            .report(report)
                            .order(order)
                            .build(),
                    true
            );
            log.info("Notification with id {} of order id {} sent to customer with id {} and email {}",
                    notification.getId(), order.getId(), owner.getId(), owner.getEmail()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifySaleStaffAction() {
        return context -> {
            String notifyMessage = context.getExtendedState().get("message", String.class);
            //Notify logic using NotificationService
            log.info(notifyMessage);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyDesignStaffAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            Staff designStaff = order.getDesignStaff();

            String title = String.format("Work assignment for order %s", order.getId());
            String description = String.format("You have been assigned to the order %s", order.getId());

            Report report = reportService.createNormalReport(order, title, description);

            Notification notification = notificationService.createNotification(Notification.builder()
                            .receiver(designStaff)
                            .report(report)
                            .order(order)
                            .build(),
                    true
            );
            log.info("Notification with id {} of order id {} sent to design staff of id {} with email {}",
                    notification.getId(), order.getId(), designStaff.getId(), designStaff.getEmail()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyProductionStaffAction() {
        return context -> {
            String notifyMessage = context.getExtendedState().get("message", String.class);
            //Notify logic using NotificationService
            log.info(notifyMessage);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyManagerAction() {
        return context -> {
            String notifyMessage = context.getExtendedState().get("message", String.class);
            //Notify logic using NotificationService
            log.info(notifyMessage);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> approvedAction () {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            StateMachine<OrderStatus, OrderEvent> stateMachine = context.getStateMachine();
            Message<OrderEvent> message;

            switch (getCurrentState(context.getStateMachine()).getId()) {
                case OrderStatus.REQ_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.REQ_APPROVE).build();
                case OrderStatus.QUO_MANA_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.QUO_MANA_APPROVE).build();
                case OrderStatus.QUO_CUST_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.QUO_CUST_DECLINE).build();
                case OrderStatus.TRANSACTION_SUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.TRANSACTION_APPROVE).build();
                case OrderStatus.DES_MANA_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_MANA_APPROVE).build();
                case OrderStatus.DES_CUST_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_CUST_APPROVE).build();
                case OrderStatus.PRO_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.PRO_APPROVE).build();
                case OrderStatus.DELIVERED_CONFIRMED ->
                        message = MessageBuilder.withPayload(OrderEvent.DELIVERED_APPROVE).build();
                default ->
                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState());
            }
            stateMachine.sendEvent(Mono.just(message)).subscribe();
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> declinedAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            StateMachine<OrderStatus, OrderEvent> stateMachine = context.getStateMachine();
            Message<OrderEvent> message;

            switch (getCurrentState(context.getStateMachine()).getId()) {
                case OrderStatus.REQ_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.REQ_DECLINE).build();
                case OrderStatus.QUO_MANA_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.QUO_MANA_DECLINE).build();
                case OrderStatus.QUO_CUST_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.QUO_CUST_DECLINE).build();
                case OrderStatus.TRANSACTION_UNSUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.TRANSACTION_DECLINE).build();
                case OrderStatus.DES_MANA_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_MANA_DECLINE).build();
                case OrderStatus.DES_CUST_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_CUST_DECLINE).build();
                case OrderStatus.PRO_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.PRO_DECLINE).build();
                case OrderStatus.DELIVERED_DENIED ->
                        message = MessageBuilder.withPayload(OrderEvent.DELIVERED_DENY).build();
                default ->
                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState());
            }
            stateMachine.sendEvent(Mono.just(message)).subscribe();
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCancelAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));

            String title = String.format("Your order %s have been cancelled", order.getId());
            String description = String.format("We are sorry to announce that your order %s have been cancelled", order.getId());

            Report report = reportService.createNormalReport(order, title, description);

            Notification notification = notificationService.createNotification(
                    Notification.builder()
                            .report(report)
                            .order(order)
                            .receiver(order.getOwner())
                            .build(),
                    false
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCustomerTransactionAction() {
        return context -> {

        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> deleteImageAction () {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            Design design = order.getDesign();
            design.setDesignLink(null);
            orderService.updateOrder(order);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyDeliveredAction () {
        return context -> {

        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyTransactionReceiptAction() {
        return context -> {

        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRestoreOrderAction() {
        return context -> {

        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRequestApprovedAction() {
        return context -> {
            log.info("notifyRequestApprovedAction called");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            MessagesConstant approvedMessage = messagesConstant.createRequestApprovedMessage(order.getOwner().getUserInfo().getFirstName());

            Report report = reportService.createNormalReport(
                    order,
                    approvedMessage.getTitle(),
                    approvedMessage.getDescription()
            );
            Notification notification = Notification.builder()
                    .report(report)
                    .order(order)
                    .receiver(order.getOwner())
                    .build();
            report.getNotifications().add(notification);
            order.getRelatedReports().add(report);
            order.getNotifications().add(notification);

//            order = orderService.updateOrder(order);
            notificationService.createNotification(notification, false);
//            reportService.updateReport(report);
            log.info("Notification approved message for owner id {}", order.getOwner().getId());
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRequestDeclinedAction () {
        return context -> {
            log.info("notifyRequestDeclinedAction called");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            MessagesConstant declinedMessage = messagesConstant.createRequestDeclinedMessage(order.getOwner().getUserInfo().getFirstName());

            Report report = Report.builder()
                    .sender(null)
                    .reportingOrder(order)
                    .createdDate(LocalDateTime.now())
                    .type(ReportType.NONE)
                    .title(declinedMessage.getTitle())
                    .description(declinedMessage.getDescription())
                    .build();
            Notification notification = Notification.builder()
                    .report(report)
                    .order(order)
                    .receiver(order.getOwner())
                    .build();
            report.getNotifications().add(notification);
            order.getRelatedReports().add(report);
            order.getNotifications().add(notification);
            order = orderService.updateOrder(order);
            notification = notificationService.createNotification(notification, false);
            log.info("Notification declined message for owner id {}", order.getOwner());
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> createChatRoomAction () {
        return context -> {

        };
    }
    //</editor-fold>
}
