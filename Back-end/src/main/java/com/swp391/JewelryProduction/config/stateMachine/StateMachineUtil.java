package com.swp391.JewelryProduction.config.stateMachine;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.services.order.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.state.StateMachineState;
import org.springframework.statemachine.support.DefaultStateMachineContext;
import org.springframework.util.ObjectUtils;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Map.Entry;

@Slf4j
public class StateMachineUtil {
    public static class Keywords {
        public static final String ORDER_ID = "orderID";
        public static final String REPORT_ID = "reportID";
        public static final String REPORT_APPROVAL = "isApproved";
        public static final String TRANSACTIONS_ID = "transactionId";
        public static final String SALE_ID = "saleId";
        public static final String TRANSACTION_CHOICE = "choice";
    }

    private static StateMachine<OrderStatus, OrderEvent> currentStateMachine;

    public static State<OrderStatus, OrderEvent> getCurrentState (StateMachine<OrderStatus, OrderEvent> stateMachine) {
        State<OrderStatus, OrderEvent> currentState = stateMachine.getState();
        while (currentState instanceof StateMachineState<OrderStatus, OrderEvent>) {
            StateMachineState<OrderStatus, OrderEvent> machineState = (StateMachineState<OrderStatus, OrderEvent>) currentState;
            currentState = machineState.getSubmachine().getState();
        }
        return currentState;
    }

    public static synchronized StateMachine<OrderStatus, OrderEvent> getStateMachine(
            String machineId, StateMachineService<OrderStatus,
            OrderEvent> stateMachineService
    ) throws RuntimeException {
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

    public static StateMachine<OrderStatus, OrderEvent> instantiateStateMachine(
            Order order,
            OrderService orderService,
            StateMachineService<OrderStatus, OrderEvent> stateMachineService) {
        String orderId = order.getId();
        StateMachine<OrderStatus, OrderEvent> stateMachine = stateMachineService.acquireStateMachine(orderId, false);
        stateMachine.getExtendedState().getVariables().put(Keywords.ORDER_ID, orderId);
        stateMachine.getStateMachineAccessor()
                .doWithAllRegions(
                        region -> region.addStateMachineInterceptor(new StateMachineInterceptor(orderService)
                        )
                );
        stateMachine.startReactively().block();
        log.info("State machine started successfully. Current state: " + stateMachine.getState().getId());
        return stateMachine;
    }

    public static void sendEvent (StateMachineService<OrderStatus, OrderEvent> stateMachineService, String machineId, OrderEvent event, Map<String, Object> additionalStateVariables) {
        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(machineId, stateMachineService);
        if (additionalStateVariables != null && !additionalStateVariables.isEmpty())
            stateMachine.getExtendedState().getVariables().putAll(additionalStateVariables);
        stateMachine.sendEvent(
                Mono.just(MessageBuilder.
                        withPayload(event)
                        .build()
                )
        ).subscribe();
    }

    public static StateMachine<OrderStatus, OrderEvent> resetState (
            Order orderWithNewState,
            StateMachineService<OrderStatus, OrderEvent> stateMachineService
    ) {
        String orderId = orderWithNewState.getId();
        StateMachine<OrderStatus, OrderEvent> stateMachine = stateMachineService.acquireStateMachine(orderId, false);

        stateMachine.stopReactively()
                .then(Mono.defer(() -> {
                    stateMachine.getStateMachineAccessor().doWithAllRegions(access -> {
                        access.resetStateMachineReactively(
                                new DefaultStateMachineContext<>(
                                        orderWithNewState.getStatus(),
                                        null,
                                        null,
                                        stateMachine.getExtendedState(),
                                        null,
                                        stateMachine.getId()
                                )
                        ).block();
                    });
                    return Mono.empty();
                }))
                .then(stateMachine.startReactively())
                .block();

        return stateMachine;
    }
}
