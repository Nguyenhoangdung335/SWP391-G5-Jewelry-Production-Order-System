package com.swp391.JewelryProduction.services.report;

import com.swp391.JewelryProduction.config.stateMachine.StateMachineInterceptor;
import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.enums.ConfirmedState;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.ReportType;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Report;
import com.swp391.JewelryProduction.repositories.ReportRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedList;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final AccountService accountService;
    private final OrderService orderService;

    private final ModelMapper modelMapper;

    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;
    private final StateMachinePersist<OrderStatus, OrderEvent, String> stateMachinePersist;
    private StateMachine<OrderStatus, OrderEvent> currentStateMachine;

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }

    @Override
    public Report createRequest(ReportRequest report, Order order) {
        Account sender = modelMapper.map(accountService.findAccountById(report.getSenderId()), Account.class);
        Report requestReport = Report.builder()
                        .reportingOrder(order)
                        .title(report.getTitle())
                        .description(report.getDescription())
                        .createdDate(LocalDateTime.now())
                        .type(ReportType.REQUEST)
                        .sender(sender)
                        .reportingOrder(order)
                        .build();
        order.setRelatedReports(new LinkedList<>(Arrays.asList(requestReport)));
        requestReport = reportRepository.save(requestReport);

        StateMachine<OrderStatus, OrderEvent> stateMachine = instantiateStateMachine(order);
        stateMachine.getExtendedState().getVariables().put("reportID", requestReport.getId());
        stateMachine.sendEvent(
                Mono.just(MessageBuilder
                        .withPayload(OrderEvent.REQ_RECEIVED)
                        .build())
        ).subscribe();
        return requestReport;
    }

    @Transactional
    @Override
    public Report createQuotationReport(ReportRequest report, Order order) {
        Report quote = Report.builder()
                .reportingOrder(order)
                .title(report.getTitle())
                .description(report.getDescription())
                .createdDate(LocalDateTime.now())
                .type(ReportType.QUOTATION)
                .sender(modelMapper.map(accountService.findAccountById(report.getSenderId()), Account.class))
                .build();
        order.getRelatedReports().add(quote);
        orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = instantiateStateMachine(order);
        stateMachine.sendEvent(Mono.just(MessageBuilder
                .withPayload(OrderEvent.QUO_MANA_PROCESS).build())
        ).subscribe();
        return quote;
    }

    @Transactional
    @Override
    public Report createDesignReport(ReportRequest report, Order order) {
        Report design = Report.builder()
                .reportingOrder(order)
                .title(report.getTitle())
                .description(report.getDescription())
                .createdDate(LocalDateTime.now())
                .type(ReportType.DESIGN)
                .sender(modelMapper.map(accountService.findAccountById(report.getSenderId()), Account.class))
                .build();
        order.getRelatedReports().add(design);
        orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = instantiateStateMachine(order);
        stateMachine.sendEvent(Mono.just(MessageBuilder
                .withPayload(OrderEvent.DES_MANA_PROCESS).build())
        ).subscribe();
        return design;
    }

    @Override
    @Transactional
    public void handleUserResponse(String orderId, ConfirmedState response) throws RuntimeException {
        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId);
        OrderStatus status = stateMachine.getState().getId();
        OrderEvent triggerEvent = switch (response) {
            case ConfirmedState.APPROVE -> {
                stateMachine.getExtendedState().getVariables().put("isApproved", true);
                yield getApprovalEvent(status);
            }
            case ConfirmedState.DECLINE -> {
                stateMachine.getExtendedState().getVariables().put("isApproved", false);
                yield getApprovalEvent(status);
            }
            default -> throw new IllegalArgumentException("Invalid response");
        };
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
        orderService.updateOrder(order);

        return newReport;
    }

    @Override
    public Report findReportByID(Integer id) {
        return reportRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Order of id " + id + " cannot be found"));
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

    private synchronized StateMachine<OrderStatus, OrderEvent> getStateMachine(String machineId) throws RuntimeException {
        if (currentStateMachine == null) {
            currentStateMachine = stateMachineService.acquireStateMachine(machineId);
            currentStateMachine.startReactively().block();
        } else if (!ObjectUtils.nullSafeEquals(currentStateMachine.getId(), machineId)) {
            stateMachineService.releaseStateMachine(currentStateMachine.getId());
            currentStateMachine.stopReactively().block();
            currentStateMachine = stateMachineService.acquireStateMachine(machineId);
            currentStateMachine.startReactively().block();
        }
        return currentStateMachine;
    }

    private StateMachine<OrderStatus, OrderEvent> instantiateStateMachine (Order order) {
        String orderId = order.getId();
        StateMachine<OrderStatus, OrderEvent> stateMachine = stateMachineService.acquireStateMachine(orderId, true);
        stateMachine.getExtendedState().getVariables().put("orderID", orderId);
        stateMachine.getStateMachineAccessor()
                .doWithAllRegions(
                        region -> region.addStateMachineInterceptor(new StateMachineInterceptor()
                        )
                );
        stateMachine.startReactively().block();
        log.info("State machine started successfully. Current state: " + stateMachine.getState().getId());
        return stateMachine;
    }
}
