package com.swp391.JewelryProduction.config.stateMachine;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.report.ReportService;
import com.swp391.JewelryProduction.util.MessagesConstant;
import com.swp391.JewelryProduction.util.exceptions.MissingContextVariableException;
import jakarta.mail.MessagingException;
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
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.action.Action;
import org.springframework.statemachine.guard.Guard;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getCurrentState;

@Slf4j
@Configuration
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
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

//    public Guard<OrderStatus, OrderEvent> checkAppropriateApprovalActionGuard () {
//        return context -> {
//            log.info("checkAppropriateApprovalActionGuard is called before transition to state {}", context.getTransition().getSource());
//
//            StateMachine<OrderStatus, OrderEvent> stateMachine = context.getStateMachine();
//            Message<OrderEvent> message;
//
//            switch (getCurrentState(context.getStateMachine()).getId()) {
//                case OrderStatus.
//                default ->
//                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState().getId());
//            }
//            stateMachine.sendEvent(Mono.just(message)).subscribe();
//        }
//    }
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

            Order order = getOrder(context, orderService);
            Report report = getReport(context, reportService);

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
                try {
                    notification = notificationService.createNotification(notification, true, true);
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
                log.info("Notification with id {} of order id {} sent to user {} of role {}",
                        notification.getId(), order.getId(), manager.getId(), manager.getRole()
                );
            });
//            context.getExtendedState().getVariables().put("acceptedBy", "manager");
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCustomerApprovalAction() {
        return context -> {
            log.info("\tnotifyCustomerApprovalAction is called\t\n");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = getOrder(context, orderService);
            Report report = getReport(context, reportService);
            Account owner = order.getOwner();

            Notification notification = Notification.builder()
                    .receiver(owner)
                    .report(report)
                    .order(order)
                    .build();
            report.getNotifications().add(notification);
            order.getNotifications().add(notification);
            try {
                notification = notificationService.createNotification(notification, true, true);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            log.info("Notification with id {} of order id {} sent to owner {}",
                    notification.getId(), order.getId(), owner.getId()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifySaleStaffAction() {
        return context -> {
            log.info("\tnotifySaleStaffAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = getOrder(context, orderService);
            Staff saleStaff = order.getSaleStaff();

            List<String> responsibilities = Arrays.asList(
                    "Engage with the customer, provide them with sufficient support about their order",
                    "Be vigilant during work hours",
                    "Provide a satisfied quotation"
            );
            MessagesConstant message = messagesConstant.createStaffAssignedMessage(order,  saleStaff, responsibilities);
            Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
            Notification notification = Notification.builder()
                    .order(order)
                    .report(report)
                    .receiver(saleStaff)
                    .build();
            report.getNotifications().add(notification);
            order.getNotifications().add(notification);
            order.getRelatedReports().add(report);

            try {
                notification = notificationService.createNotification(notification, false, true);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }

            //Notify logic using NotificationService
            log.info("Notification with id {} has been sent ot sale staff with id {} for order {}",
                    notification.getId(), saleStaff.getId(), order.getId()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyDesignStaffAction() {
        return context -> {
//            OrderService orderService = applicationContext.getBean(OrderService.class);
//            ReportService reportService = applicationContext.getBean(ReportService.class);
//            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
//
//            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
//            Staff designStaff = order.getDesignStaff();
//
//            String title = String.format("Work assignment for order %s", order.getId());
//            String description = String.format("You have been assigned to the order %s", order.getId());
//
//            Report report = reportService.createNormalReport(order, title, description);
//
//            Notification notification = notificationService.createNotification(Notification.builder()
//                            .receiver(designStaff)
//                            .report(report)
//                            .order(order)
//                            .build(),
//                    true
//            );
//            log.info("Notification with id {} of order id {} sent to design staff of id {} with email {}",
//                    notification.getId(), order.getId(), designStaff.getId(), designStaff.getEmail()
//            );
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
            log.info("approvedAction called during transition from {} to {}",context.getTransition().getSource(), context.getTransition().getTarget());

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
                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState().getId());
            }
            stateMachine.sendEvent(Mono.just(message)).subscribe();
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> declinedAction() {
        return context -> {
            log.info("declinedAction called during transition from {} to {}",context.getTransition().getSource(), context.getTransition().getTarget());

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
                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState().getId());
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

            Order order = getOrder(context, orderService);
            Account owner = order.getOwner();
            List<String> cancelReasons = Arrays.asList("You have not completed the transaction in time, thus rendering your order invalid.", "Your request is deemed to be inappropriate.");
            MessagesConstant message = messagesConstant.createOrderCancelMessage(owner.getUserInfo().getFirstName(), cancelReasons, order);

            Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
            Notification notification = Notification.builder()
                    .report(report)
                    .order(order)
                    .receiver(order.getOwner())
                    .build();
            report.getNotifications().add(notification);
            order.getRelatedReports().add(report);
            order.getNotifications().add(notification);

            try {
                notification = notificationService.createNotification(notification);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }

            log.info("Notification cancel order id {} of owner id {}", order.getId(), owner.getId());
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

            try {
                notificationService.createNotification(notification, false);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            log.info("Notification approved message for owner id {}", order.getOwner().getId());
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRequestDeclinedAction () {
        return context -> {
            log.info("notifyRequestDeclinedAction called");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);

            Order order = orderService.findOrderById(context.getExtendedState().get("orderID", String.class));
            MessagesConstant declinedMessage = messagesConstant.createRequestDeclinedMessage(order.getOwner().getUserInfo().getFirstName());

            Report report = reportService.createNormalReport(
                    order,
                    declinedMessage.getTitle(),
                    declinedMessage.getDescription()
            );
            Notification notification = Notification.builder()
                    .report(report)
                    .order(order)
                    .receiver(order.getOwner())
                    .build();
            report.getNotifications().add(notification);
            order.getRelatedReports().add(report);
            order.getNotifications().add(notification);

            try {
                notificationService.createNotification(notification, false);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            log.info("Notification declined message for owner id {}", order.getOwner());
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> createChatRoomAction () {
        return context -> {

        };
    }

    private Order getOrder (StateContext<OrderStatus, OrderEvent> context, OrderService orderService) {
        String orderID = context.getExtendedState().get("orderID", String.class);
        if (orderID == null) {
            String errorMsg = String.format("orderID is missing, state: %s", context.getSource());
            log.error(errorMsg);
            throw new MissingContextVariableException(errorMsg);
        }
        return orderService.findOrderById(orderID);
    }

    private Report getReport (StateContext<OrderStatus, OrderEvent> context, ReportService reportService) {
        Integer reportID = context.getExtendedState().get("reportID", Integer.class);
        if (reportID == null) {
            String errorMsg = String.format("reportID is missing, state: %s", context.getSource());
            log.error(errorMsg);
            throw new MissingContextVariableException(errorMsg);
        }
        return reportService.findReportByID(reportID);
    }

    //</editor-fold>
}
