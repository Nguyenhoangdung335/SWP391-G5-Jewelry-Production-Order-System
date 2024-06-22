package com.swp391.JewelryProduction.util;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.state.StateMachineState;
import org.springframework.util.ObjectUtils;

public class StateMachineUtil {
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
}
