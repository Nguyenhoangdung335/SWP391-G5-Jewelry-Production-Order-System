package com.swp391.JewelryProduction.config.stateMachine;

import com.paypal.api.payments.Payer;
import com.paypal.base.rest.PayPalRESTException;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.services.PaypalService;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.email.EmailService;
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
import org.springframework.beans.factory.annotation.Value;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.Keywords.*;
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getCurrentState;

@Slf4j
@Configuration
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class ActionAndGuardConfiguration implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    private final MessagesConstant messagesConstant = new MessagesConstant();
    @Value("${url.fe}")
    private String baseClientURL;

    @Override
    public void setApplicationContext(@NotNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    //<editor-fold desc="GUARD BEAN" defaultstate="collapsed">
    @Bean
    public Guard<OrderStatus, OrderEvent> checkApprovalGuard() {
        return context -> {
            Boolean approved = context.getExtendedState().get(REPORT_APPROVAL, Boolean.class);
            return approved != null && approved;
        };
    }

    @Bean
    public Guard<OrderStatus, OrderEvent> checkTransactionGuard () {
        return context -> {
            Boolean successful = context.getExtendedState().get(TRANSACTION_CHOICE, Boolean.class);
            return successful != null && successful;
        };
    }

    @Bean
    public Guard<OrderStatus, OrderEvent> checkIsFromTemplate () {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);
            Order order = getOrder(context, orderService);
            return order != null && order.isFromTemplate();
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
                } catch (MessagingException ignored) {
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
            } catch (MessagingException ignored) {
            }
            log.info("Notification with id {} of order id {} sent to owner {}",
                    notification.getId(), order.getId(), owner.getId()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRequestApprovedAction() {
        return context -> {
            log.info("notifyRequestApprovedAction called");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);

            Order order = getOrder(context, orderService);
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
                notificationService.createNotification(notification, false, true);
            } catch (MessagingException ignored) {
            }
            log.info("Notification approved message for owner id {}", order.getOwner().getId());
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCancelAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            PaypalService paypalService = applicationContext.getBean(PaypalService.class);

            Order order = getOrder(context, orderService);
            Account owner = order.getOwner();
            owner.setCurrentOrder(null);
            MessagesConstant message = messagesConstant.createOrderCancelMessage(owner.getUserInfo().getFirstName(), order);

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
                paypalService.refundSale("USD", order);
                notification = notificationService.createNotification(notification);
            } catch (MessagingException ignored) {
            } catch (PayPalRESTException ex) {
                throw new RuntimeException("Failed to refund");
            }

            log.info("Notification cancel order id {} of owner id {}", order.getId(), owner.getId());
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
            } catch (MessagingException ignored) {
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
            log.info("\tnotifyDesignStaffAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = getOrder(context, orderService);
            Staff designStaff = order.getDesignStaff();

            List<String> responsibilities = Arrays.asList(
                    "Design a suitable design for the customer based on the created specification for that order",
                    "Be vigilant during work hours",
                    "Provide a satisfied design"
            );
            MessagesConstant message = messagesConstant.createStaffAssignedMessage(order, designStaff, responsibilities);
            Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
            Notification notification = Notification.builder()
                    .order(order)
                    .report(report)
                    .receiver(designStaff)
                    .build();
            report.getNotifications().add(notification);
            order.getNotifications().add(notification);
            order.getRelatedReports().add(report);

            try {
                notification = notificationService.createNotification(notification, false, true);
            } catch (MessagingException ignored) {
            }

            //Notify logic using NotificationService
            log.info("Notification with id {} has been sent ot design staff with id {} for order {}",
                    notification.getId(), designStaff.getId(), order.getId()
            );
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyProductionStaffAction() {
        return context -> {
            log.info("\tnotifyDesignStaffAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            Order order = getOrder(context, orderService);
            Staff productionStaff = order.getProductionStaff();

            List<String> responsibilities = Arrays.asList(
                    "Design a suitable design for the customer based on the created specification for that order",
                    "Be vigilant during work hours",
                    "Provide a satisfied quotation"
            );
            MessagesConstant message = messagesConstant.createStaffAssignedMessage(order, productionStaff, responsibilities);
            Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
            Notification notification = Notification.builder()
                    .order(order)
                    .report(report)
                    .receiver(productionStaff)
                    .build();
            report.getNotifications().add(notification);
            order.getNotifications().add(notification);
            order.getRelatedReports().add(report);

            try {
                notification = notificationService.createNotification(notification, false, true);
            } catch (MessagingException ignored) {
            }

            //Notify logic using NotificationService
            log.info("Notification with id {} has been sent ot design staff with id {} for order {}",
                    notification.getId(), productionStaff.getId(), order.getId()
            );
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
                        message = MessageBuilder.withPayload(OrderEvent.QUO_CUST_APPROVE).build();
                case OrderStatus.BET_TRANSACTION_SUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.BET_TRANSACTION_APPROVE).build();
                case OrderStatus.DES_MANA_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_MANA_APPROVE).build();
                case OrderStatus.DES_CUST_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_CUST_APPROVE).build();
                case OrderStatus.PRO_APPROVED ->
                        message = MessageBuilder.withPayload(OrderEvent.PRO_APPROVE).build();
                case OrderStatus.DELIVERED_CONFIRMED ->
                        message = MessageBuilder.withPayload(OrderEvent.DELIVERED_APPROVE).build();
                case OrderStatus.REMAIN_TRANSACTION_SUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.REMAIN_TRANSACTION_APPROVE).build();
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
                case OrderStatus.BET_TRANSACTION_UNSUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.BET_TRANSACTION_DECLINE).build();
                case OrderStatus.DES_MANA_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_MANA_DECLINE).build();
                case OrderStatus.DES_CUST_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.DES_CUST_DECLINE).build();
                case OrderStatus.PRO_DECLINED ->
                        message = MessageBuilder.withPayload(OrderEvent.PRO_DECLINE).build();
                case OrderStatus.DELIVERED_DENIED ->
                        message = MessageBuilder.withPayload(OrderEvent.DELIVERED_DENY).build();
                case OrderStatus.REMAIN_TRANSACTION_UNSUCCESSFUL ->
                        message = MessageBuilder.withPayload(OrderEvent.REMAIN_TRANSACTION_DECLINE).build();
                default ->
                        throw new RuntimeException("Unexpected state machine state " + context.getStateMachine().getState().getId());
            }
            stateMachine.sendEvent(Mono.just(message)).subscribe();
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyCustomerTransactionAction() {
        return context -> {
            log.info("\tnotifyTransactionReceiptAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            EmailService emailService = applicationContext.getBean(EmailService.class);

            try {
                Order order = getOrder(context, orderService);
                Account owner = order.getOwner();
                Quotation quotation = order.getQuotation();
                String actionURL = baseClientURL + "";

                Map<String, Object> variables = new HashMap<>();
                Map<String, String> receiptItems = new HashMap<>();

                for (QuotationItem item : quotation.getQuotationItems()) {
                    receiptItems.put(item.getName(), String.valueOf(item.getTotalPrice()));
                }
                variables.put("items", receiptItems);
                variables.put("name", owner.getUserInfo().getFirstName());
                variables.put("businessName", "Custom Jewelery");
                variables.put("total", "$100.00");
                variables.put("due_date", quotation.getExpiredDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                variables.put("action_url", actionURL);
                variables.put("currentYear", 2024);

                emailService.sendInvoiceEmail(owner.getEmail(), "Receipt for order " + order.getId(), variables);
            } catch (MessagingException ignored) {
            }
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRemainingTransactionAction () {
        return context -> {
            log.info("\tnotifyRemainingTransactionAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            try {
                Order order = getOrder(context, orderService);
                Account owner = order.getOwner();

                MessagesConstant message = messagesConstant.createRemainingTransactionMessage(owner.getUserInfo().getFirstName() + " " + owner.getUserInfo().getLastName(), order);
                Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
                Notification notification = Notification.builder()
                        .order(order)
                        .report(report)
                        .receiver(owner)
                        .build();
                report.getNotifications().add(notification);
                order.getNotifications().add(notification);
                order.getRelatedReports().add(report);

                notificationService.createNotification(notification, false, true);
            } catch (MessagingException ignored) {
            }
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> deleteDesignAction() {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);

            Order order = getOrder(context, orderService);
            order.setDesign(null);

            orderService.updateOrder(order);
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> deleteProofAction () {
        return context -> {
            OrderService orderService = applicationContext.getBean(OrderService.class);

            Order order = getOrder(context, orderService);
            order.setProofUrl(null);
            order = orderService.updateOrder(order);

            log.info("Delete product proof of order {} successfully", order.getId());
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
            log.info("\tnotifyTransactionReceiptAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            PaypalService paypalService = applicationContext.getBean(PaypalService.class);
            EmailService emailService = applicationContext.getBean(EmailService.class);

            try {
                Order order = getOrder(context, orderService);
                Account owner = order.getOwner();
                Transactions transactions = order.getTransactions();
                Quotation quotation = order.getQuotation();
                Payer payer;
                    payer = paypalService.getPaymentDetails(transactions.getPaypalPaymentId()).getPayer();

                Map<String, Object> variables = new HashMap<>();
                Map<String, String> receiptItems = new HashMap<>();

                for (QuotationItem item : quotation.getQuotationItems()) {
                    receiptItems.put(item.getName(), String.valueOf(item.getTotalPrice()));
                }
                variables.put("items", receiptItems);
                variables.put("name", owner.getUserInfo().getFirstName());
                variables.put("businessName", "Custom Jewelery");
                variables.put("payerName", payer.getPayerInfo().getFirstName());
                variables.put("receipt_id", order.getTransactions().getPaypalPaymentId());
                variables.put("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                variables.put("total", "$100.00");
                variables.put("currentYear", 2024);

                emailService.sendReceiptEmail(owner.getEmail(), "Receipt for order " + order.getId(), variables);
            } catch (PayPalRESTException e) {
                throw new RuntimeException("System error, cannot get Paypal payer details", e);
            } catch (MessagingException ignored) {
            }
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyOrderCompleteAction () {
        return context -> {
            log.info("\tnotifyOrderCompleteAction is called\t");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);

            try {
                Order order = getOrder(context, orderService);
                Account owner = order.getOwner();
                MessagesConstant message = messagesConstant.createOrderCompletedMessage(owner.getUserInfo().getFirstName(), order);

                order.setCompletedDate(LocalDateTime.now());
                Product product = order.getProduct();
                if (product != null && (product.getImageURL() == null || product.getImageURL().isEmpty()))
                    product.setImageURL(order.getProofUrl());
                Report report = reportService.createNormalReport(order, message.getTitle(), message.getDescription());
                Notification notification = Notification.builder()
                        .order(order)
                        .report(report)
                        .receiver(owner)
                        .build();
                report.getNotifications().add(notification);
                order.getNotifications().add(notification);
                order.getRelatedReports().add(report);

                order = orderService.updateOrder(order);
                notificationService.createNotification(notification, false, true);
            } catch (Exception ex) {
            }
        };
    }

    @Bean
    public Action<OrderStatus, OrderEvent> notifyRequestDeclinedAction () {
        return context -> {
            log.info("notifyRequestDeclinedAction called");

            OrderService orderService = applicationContext.getBean(OrderService.class);
            NotificationService notificationService = applicationContext.getBean(NotificationService.class);
            ReportService reportService = applicationContext.getBean(ReportService.class);

            Order order = getOrder(context, orderService);
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

    private Order getOrder (StateContext<OrderStatus, OrderEvent> context, OrderService orderService) {
        String orderID = context.getExtendedState().get(ORDER_ID, String.class);
        if (orderID == null) {
            String errorMsg = String.format("orderID is missing, state: %s", context.getSource());
            log.error(errorMsg);
            throw new MissingContextVariableException(errorMsg);
        }
        return orderService.findOrderById(orderID);
    }

    private Report getReport (StateContext<OrderStatus, OrderEvent> context, ReportService reportService) {
        Integer reportID = context.getExtendedState().get(REPORT_ID, Integer.class);
        if (reportID == null) {
            String errorMsg = String.format("reportID is missing, state: %s", context.getSource());
            log.error(errorMsg);
            throw new MissingContextVariableException(errorMsg);
        }
        return reportService.findReportByID(reportID);
    }

    //</editor-fold>
}
