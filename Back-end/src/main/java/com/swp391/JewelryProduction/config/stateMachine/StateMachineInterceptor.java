package com.swp391.JewelryProduction.config.stateMachine;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.services.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.support.StateMachineInterceptorAdapter;
import org.springframework.statemachine.transition.Transition;

import static com.swp391.JewelryProduction.util.StateMachineUtil.getCurrentState;

@Slf4j
@RequiredArgsConstructor
public class StateMachineInterceptor extends StateMachineInterceptorAdapter<OrderStatus, OrderEvent> {

    private final OrderService orderService;

    @Override
    public Exception stateMachineError(StateMachine<OrderStatus, OrderEvent> stateMachine, Exception exception) {
        log.error("StateMachine error: {}", exception.getMessage(), exception);
        return exception;
    }

    @Override
    public void preStateChange(
            State<OrderStatus, OrderEvent> state,
            Message<OrderEvent> message,
            Transition<OrderStatus, OrderEvent> transition,
            StateMachine<OrderStatus, OrderEvent> stateMachine,
            StateMachine<OrderStatus, OrderEvent> rootStateMachine)
    {
        log.info("Pre State Change: State = {}, Message = {}, Transition = {}, State Machine Id = {}",
                state, message, transition, stateMachine.getId());
        try {
            super.preStateChange(state, message, transition, stateMachine, rootStateMachine);
        } catch (Exception e) {
            throw new RuntimeException("Error during state change", e);
        }
    }

    @Override
    public Message<OrderEvent> preEvent(Message<OrderEvent> message, StateMachine<OrderStatus, OrderEvent> stateMachine) {
        log.info("Pre Event: Message = {}, State Machine Id = {}", message, stateMachine.getId());
        return message;
    }

    @Override
    public StateContext<OrderStatus, OrderEvent> preTransition(StateContext<OrderStatus, OrderEvent> stateContext) {
        log.info("Pre Transition: Transition = {}, State Machine Id = {}", stateContext.getTransition(), stateContext.getStateMachine().getId());
        return stateContext;
    }

    @Override
    public StateContext<OrderStatus, OrderEvent> postTransition(StateContext<OrderStatus, OrderEvent> stateContext) {
        log.info("Post Transition: Transition = {}, State Machine Id = {}", stateContext.getTransition(), stateContext.getStateMachine().getId());
        return stateContext;
    }

    @Override
    public void postStateChange(State<OrderStatus, OrderEvent> state, Message<OrderEvent> message, Transition<OrderStatus, OrderEvent> transition, StateMachine<OrderStatus, OrderEvent> stateMachine, StateMachine<OrderStatus, OrderEvent> rootStateMachine) {
        log.info("Post Transition: State = {}, State Machine Id = {}, Transition = {}", state, stateMachine.getId(), transition);
        Order order = orderService.findOrderById(stateMachine.getId());
        order.setStatus(state.getId());
        orderService.updateOrder(order);
        super.postStateChange(state, message, transition, stateMachine, rootStateMachine);
    }
}