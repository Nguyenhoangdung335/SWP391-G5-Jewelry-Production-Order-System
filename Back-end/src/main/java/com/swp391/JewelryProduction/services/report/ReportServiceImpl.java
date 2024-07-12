package com.swp391.JewelryProduction.services.report;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.ReportType;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.repositories.NotificationRepository;
import com.swp391.JewelryProduction.repositories.ReportRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.notification.NotificationService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.statemachine.state.State;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.*;
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.Keywords.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final AccountService accountService;
    private final OrderService orderService;
    private final NotificationRepository notificationRepository;

    private final ModelMapper modelMapper;

    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }

    @Transactional
    @Override
    public Report createRequest(ReportRequest report, Order order, Product product) {
        Account sender = accountService.findAccountById(report.getSenderId());
        Report requestReport = Report.builder()
                        .reportingOrder(order)
                        .title(report.getTitle())
                        .description(report.getDescription())
                        .createdDate(LocalDateTime.now())
                        .type(ReportType.REQUEST)
                        .sender(sender)
                        .reportingOrder(order)
                        .build();
        order.getRelatedReports().add(requestReport);
        order.setProduct(product);
        requestReport = reportRepository.save(requestReport);
        product.setOrder(order);
        order = orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(order.getId(), stateMachineService);
        stateMachine.getExtendedState().getVariables().put(REPORT_ID, requestReport.getId());
        stateMachine.sendEvent(
                Mono.just(MessageBuilder
                        .withPayload(OrderEvent.REQ_RECEIVED)
                        .build())
        ).subscribe();
        return requestReport;
    }

    @Transactional
    @Override
    public Report createQuotationReport(ReportRequest report, Order order, Quotation quotation) {
        Account acc = accountService.findAccountById(report.getSenderId());
        Report quote = Report.builder()
                .reportingOrder(order)
                .title(report.getTitle())
                .description(report.getDescription())
                .createdDate(LocalDateTime.now())
                .type(ReportType.QUOTATION)
                .sender(acc)
                .build();
        order.getRelatedReports().add(quote);
        order.setQuotation(quotation);
        quote = reportRepository.save(quote);
        quotation.setOrder(order);
        order = orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(order.getId(), stateMachineService);
        stateMachine.getExtendedState().getVariables().put(REPORT_ID, quote.getId());
        stateMachine.sendEvent(Mono.just(MessageBuilder
                .withPayload(OrderEvent.QUO_FINISH).build())
        ).subscribe();
        return quote;
    }

    @Transactional
    @Override
    public Report createDesignReport(ReportRequest report, Order order, Design design) {
        Report designReport = Report.builder()
                .reportingOrder(order)
                .title(report.getTitle())
                .description(report.getDescription())
                .createdDate(LocalDateTime.now())
                .type(ReportType.DESIGN)
                .sender(modelMapper.map(accountService.findAccountById(report.getSenderId()), Account.class))
                .build();
        order.getRelatedReports().add(designReport);
        order.setDesign(design);
        designReport = reportRepository.save(designReport);
        design.setOrder(order);
        orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(order.getId(), stateMachineService);
        stateMachine.getExtendedState().getVariables().put(REPORT_ID, designReport.getId());
        stateMachine.sendEvent(Mono.just(MessageBuilder
                .withPayload(OrderEvent.DES_FINISH).build())
        ).subscribe();
        return designReport;
    }

    @Override
    @Transactional
    public void handleUserResponse(int notificationId, String orderId, boolean isApproved) throws RuntimeException {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if(notification.get().isOption()){
            notification.get().setOption(false);
        }

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId, stateMachineService);
        State<OrderStatus, OrderEvent> currentState = getCurrentState(stateMachine);

        log.info("Handling Response: Current state {}", currentState.getId());
        stateMachine.getExtendedState().getVariables().put(REPORT_APPROVAL, isApproved);
        OrderEvent triggerEvent = getApprovalEvent(currentState.getId());

        stateMachine.sendEvent(Mono.just(MessageBuilder.withPayload(triggerEvent).build())).subscribe();
    }

    @Transactional
    @Override
    public Report createNormalReport(Order order, String title, String content) {
        Report newReport = Report.builder()
                .title(title)
                .description(content)
                .sender(null)
                .createdDate(LocalDateTime.now())
                .reportingOrder(order)
                .type(ReportType.NONE)
                .build();
        order.getRelatedReports().add(newReport);
        return reportRepository.save(newReport);
    }

    @Override
    public Report findReportByID(Integer id) {
        return reportRepository
                .findById(id)
                .orElseThrow(
                        () -> new ObjectNotFoundException("Order of id " + id + " cannot be found")
                );
    }

    @Override
    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }

    private OrderEvent getApprovalEvent(OrderStatus approvalType) {
        return switch (approvalType) {
            case OrderStatus.REQ_AWAIT_APPROVAL         ->  OrderEvent.REQ_PROCESS;
            case OrderStatus.QUO_AWAIT_MANA_APPROVAL    ->  OrderEvent.QUO_MANA_PROCESS;
            case OrderStatus.QUO_AWAIT_CUST_APPROVAL    ->  OrderEvent.QUO_CUST_PROCESS;
            case OrderStatus.DES_AWAIT_MANA_APPROVAL    ->  OrderEvent.DES_MANA_PROCESS;
            case OrderStatus.DES_AWAIT_CUST_APPROVAL    ->  OrderEvent.DES_CUST_PROCESS;
            case OrderStatus.PRO_AWAIT_APPROVAL         ->  OrderEvent.PRO_PROCESS;
            case OrderStatus.DELIVERED_AWAIT_APPROVAL   ->  OrderEvent.DELIVERED_PROCESS;
            default -> throw new IllegalArgumentException("Invalid approval type");
        };
    }


}
