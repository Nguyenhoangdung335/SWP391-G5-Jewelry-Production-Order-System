package com.swp391.JewelryProduction.config.stateMachine;

import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.data.RepositoryState;
import org.springframework.statemachine.data.RepositoryTransition;
import org.springframework.statemachine.data.StateRepository;
import org.springframework.statemachine.data.TransitionRepository;
import org.springframework.statemachine.listener.StateMachineListener;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.persist.StateMachineRuntimePersister;
import org.springframework.statemachine.processor.StateMachineAnnotationPostProcessor;
import org.springframework.statemachine.state.State;

@Slf4j
@Configuration
@EnableStateMachineFactory
@RequiredArgsConstructor
public class StateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderStatus, OrderEvent> {

    private final ActionAndGuardConfiguration actionAndGuardConfiguration;


    private StateRepository<? extends RepositoryState> stateRepository;
    private TransitionRepository<? extends RepositoryTransition> transitionRepository;
    private final StateMachineRuntimePersister<OrderStatus, OrderEvent, String> stateMachineRuntimePersister;

    @Bean
    public static StateMachineAnnotationPostProcessor stateMachineAnnotationPostProcessor() {
        return new StateMachineAnnotationPostProcessor();
    }

    @Bean
    public StateMachineListener<OrderStatus, OrderEvent> loggingListener() {
        return new StateMachineListenerAdapter<OrderStatus, OrderEvent>() {
            @Override
            public void stateChanged(State<OrderStatus, OrderEvent> from, State<OrderStatus, OrderEvent> to) {
                // Optional: Log state changes
                log.info("State changed from {} to {}", from, to);
            }
        };
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<OrderStatus, OrderEvent> config) throws Exception {
        config
                .withPersistence()
                .runtimePersister(stateMachineRuntimePersister)
                .and()
                .withConfiguration()
                .listener(loggingListener())
        ;
    }

    @Override
    public void configure(StateMachineStateConfigurer<OrderStatus, OrderEvent> states) throws Exception {
        states
            .withStates()
                .initial(OrderStatus.REQUEST)
                .state(OrderStatus.QUOTATION)
                .state(OrderStatus.DESIGN)
                .state(OrderStatus.PRODUCTION)
                .state(OrderStatus.TRANSPORT)
//                .state(OrderStatus.CANCEL)
//                .history(OrderStatus.ORDER_RESTORED, StateConfigurer.History.DEEP)          //History state for reverting back
                .end(OrderStatus.ORDER_COMPLETED)                                           //End state for finalize the order

                .and()
                    .withStates()
                    .parent(OrderStatus.REQUEST)
                        .initial(OrderStatus.REQUESTING)
                        .state(OrderStatus.REQ_AWAIT_APPROVAL)
                            .choice(OrderStatus.REQ_APPROVAL_PROCESS)
                                .state(OrderStatus.REQ_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.REQ_DECLINED, actionAndGuardConfiguration.declinedAction(), null)
                        .state(OrderStatus.AWAIT_ASSIGN_STAFF)
                        .state(OrderStatus.IN_EXCHANGING, actionAndGuardConfiguration.createChatRoomAction(), null)

                .and()
                    .withStates()
                    .parent(OrderStatus.QUOTATION)
                        .initial(OrderStatus.AWAIT_QUO)
                        .state(OrderStatus.QUO_AWAIT_MANA_APPROVAL)
                            .choice(OrderStatus.QUO_MANA_APPROVAL_PROCESS)
                                .state(OrderStatus.QUO_MANA_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.QUO_MANA_DECLINED, actionAndGuardConfiguration.declinedAction(), null)
                        .state(OrderStatus.QUO_AWAIT_CUST_APPROVAL)
                            .choice(OrderStatus.QUO_CUST_APPROVAL_PROCESS)
                                .state(OrderStatus.QUO_CUST_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.QUO_CUST_DECLINED, actionAndGuardConfiguration.declinedAction(), null)
                        .state(OrderStatus.AWAIT_TRANSACTION)
                            .choice(OrderStatus.TRANSACTION_PROCESS)
                                .state(OrderStatus.TRANSACTION_SUCCESSFUL, actionAndGuardConfiguration.approvedAction(), actionAndGuardConfiguration.notifyTransactionReceiptAction())
                                .state(OrderStatus.TRANSACTION_UNSUCCESSFUL, actionAndGuardConfiguration.declinedAction(), null)

                .and()
                    .withStates()
                    .parent(OrderStatus.DESIGN)
                        .initial(OrderStatus.IN_DESIGNING)
                        .state(OrderStatus.DES_AWAIT_MANA_APPROVAL)
                            .choice(OrderStatus.DES_MANA_APPROVAL_PROCESS)
                                .state(OrderStatus.DES_MANA_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.DES_MANA_DECLINED, actionAndGuardConfiguration.declinedAction(), null)
                        .state(OrderStatus.DES_AWAIT_CUST_APPROVAL)
                            .choice(OrderStatus.DES_CUST_APPROVAL_PROCESS)
                                .state(OrderStatus.DES_CUST_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.DES_CUST_DECLINED, actionAndGuardConfiguration.declinedAction(), null)

                .and()
                    .withStates()
                    .parent(OrderStatus.PRODUCTION)
                        .initial(OrderStatus.IN_PRODUCTION)
                        .state(OrderStatus.PRO_AWAIT_APPROVAL)
                            .choice(OrderStatus.PRO_APPROVAL_PROCESS)
                                .state(OrderStatus.PRO_APPROVED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.PRO_DECLINED, actionAndGuardConfiguration.declinedAction(), null)

                .and()
                    .withStates()
                    .parent(OrderStatus.TRANSPORT)
                        .initial(OrderStatus.ON_DELIVERING)
                        .state(OrderStatus.DELIVERED_AWAIT_APPROVAL)
                            .choice(OrderStatus.DELIVERED_APPROVAL_PROCESS)
                                .state(OrderStatus.DELIVERED_CONFIRMED, actionAndGuardConfiguration.approvedAction(), null)
                                .state(OrderStatus.DELIVERED_DENIED, actionAndGuardConfiguration.declinedAction(), null)
        ;

    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderStatus, OrderEvent> transitions) throws Exception {
        transitions
                /*----------------------------------------------------------------------------------------------------*/
                /*--------------------------------CANCEL TRANSITION LOGIC (IN-WORKING)--------------------------------*/

//                .withExternal()
//                .source(OrderStatus.CANCEL).target(OrderStatus.ORDER_RESTORED)
//                .event(OrderEvent.RESTORE_ORDER)
//                .action(actionAndGuardConfiguration.notifyRestoreOrderAction())
//                .and()
//                .withHistory()
//                .source(OrderStatus.ORDER_RESTORED).target(OrderStatus.REQUESTING)  //Placeholder target
//
                /*---------------------------------------------------------------------------------------------------*/
                /*--------------------------------REQUEST SUPERSTATE LOCAL TRANSITION--------------------------------*/

//                .and()
                .withLocal()
                .source(OrderStatus.REQUESTING).target(OrderStatus.REQ_AWAIT_APPROVAL)
                .event(OrderEvent.REQ_RECEIVED)
                .action(actionAndGuardConfiguration.notifyManagerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.REQ_AWAIT_APPROVAL).target(OrderStatus.REQ_APPROVAL_PROCESS)
                .event(OrderEvent.REQ_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.REQ_APPROVAL_PROCESS)
                .first(OrderStatus.REQ_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.REQ_DECLINED)
                .and()
                .withExternal()
                .source(OrderStatus.REQ_DECLINED).target(OrderStatus.CANCEL)
                .event(OrderEvent.REQ_DECLINE)
                .action(actionAndGuardConfiguration.notifyRequestDeclinedAction())
                .and()
                .withLocal()
                .source(OrderStatus.REQ_APPROVED).target(OrderStatus.AWAIT_ASSIGN_STAFF)
                .event(OrderEvent.REQ_APPROVE)
                .action(actionAndGuardConfiguration.notifyRequestApprovedAction())
                .and()
                .withLocal()
                .source(OrderStatus.AWAIT_ASSIGN_STAFF).target(OrderStatus.IN_EXCHANGING)
                .event(OrderEvent.ASSIGN_STAFF)

                /*------------------------------------------------------------------------------------------------*/
                /*------------------------------------------------------------------------------------------------*/

                .and()
                .withExternal()
                .source(OrderStatus.IN_EXCHANGING).target(OrderStatus.AWAIT_QUO)
                .event(OrderEvent.FINALIZE_IDEA)

                /*-----------------------------------------------------------------------------------------------------*/
                /*--------------------------------QUOTATION SUPERSTATE LOCAL TRANSITION--------------------------------*/

                .and()
                .withLocal()
                .source(OrderStatus.AWAIT_QUO).target(OrderStatus.QUO_AWAIT_MANA_APPROVAL)
                .event(OrderEvent.QUO_FINISH)
                .action(actionAndGuardConfiguration.notifyManagerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.QUO_AWAIT_MANA_APPROVAL).target(OrderStatus.QUO_MANA_APPROVAL_PROCESS)
                .event(OrderEvent.QUO_MANA_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.QUO_MANA_APPROVAL_PROCESS)
                .first(OrderStatus.QUO_MANA_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.QUO_MANA_DECLINED)
                .and()
                .withLocal()
                .source(OrderStatus.QUO_MANA_APPROVED).target(OrderStatus.QUO_AWAIT_CUST_APPROVAL)
                .event(OrderEvent.QUO_MANA_APPROVE)
                .action(actionAndGuardConfiguration.notifyCustomerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.QUO_MANA_DECLINED).target(OrderStatus.AWAIT_QUO)
                .event(OrderEvent.QUO_MANA_DECLINE)
                .and()
                .withLocal()
                .source(OrderStatus.QUO_AWAIT_CUST_APPROVAL).target(OrderStatus.QUO_CUST_APPROVAL_PROCESS)
                .event(OrderEvent.QUO_CUST_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.QUO_CUST_APPROVAL_PROCESS)
                .first(OrderStatus.QUO_CUST_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.QUO_CUST_DECLINED)
                .and()
                .withLocal()
                .source(OrderStatus.QUO_CUST_APPROVED).target(OrderStatus.AWAIT_TRANSACTION)
                .event(OrderEvent.QUO_CUST_APPROVE)
                .action(actionAndGuardConfiguration.notifyCustomerTransactionAction())
                .and()
                .withLocal()
                .source(OrderStatus.QUO_CUST_DECLINED).target(OrderStatus.AWAIT_QUO)
                .event(OrderEvent.QUO_CUST_DECLINE)
                .and()
                .withLocal()
                .source(OrderStatus.AWAIT_TRANSACTION).target(OrderStatus.TRANSACTION_PROCESS)
                .event(OrderEvent.TRANSACTION_MAKE)
                .and()
                .withChoice()
                .source(OrderStatus.TRANSACTION_PROCESS)
                .first(OrderStatus.TRANSACTION_SUCCESSFUL, actionAndGuardConfiguration.checkTransactionGuard())
                .last(OrderStatus.TRANSACTION_UNSUCCESSFUL)
                .and()
                .withLocal()
                .source(OrderStatus.TRANSACTION_UNSUCCESSFUL).target(OrderStatus.AWAIT_TRANSACTION)
                .event(OrderEvent.TRANSACTION_DECLINE)

                /*------------------------------------------------------------------------------------------------*/
                /*------------------------------------------------------------------------------------------------*/

                .and()
                .withExternal()
                .source(OrderStatus.TRANSACTION_SUCCESSFUL).target(OrderStatus.IN_DESIGNING)
                .event(OrderEvent.TRANSACTION_APPROVE)
                .action(actionAndGuardConfiguration.notifyDesignStaffAction())

                /*--------------------------------------------------------------------------------------------------*/
                /*--------------------------------DESIGN SUPERSTATE LOCAL TRANSITION--------------------------------*/

                .and()
                .withLocal()
                .source(OrderStatus.IN_DESIGNING).target(OrderStatus.DES_AWAIT_MANA_APPROVAL)
                .event(OrderEvent.QUO_FINISH)
                .action(actionAndGuardConfiguration.notifyManagerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.DES_AWAIT_MANA_APPROVAL).target(OrderStatus.DES_MANA_APPROVAL_PROCESS)
                .event(OrderEvent.DES_MANA_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.DES_MANA_APPROVAL_PROCESS)
                .first(OrderStatus.DES_MANA_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.DES_MANA_DECLINED)
                .and()
                .withLocal()
                .source(OrderStatus.DES_MANA_APPROVED).target(OrderStatus.DES_AWAIT_CUST_APPROVAL)
                .event(OrderEvent.DES_MANA_APPROVE)
                .action(actionAndGuardConfiguration.notifyCustomerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.DES_MANA_DECLINED).target(OrderStatus.IN_DESIGNING)
                .event(OrderEvent.DES_MANA_DECLINE)
                .action(actionAndGuardConfiguration.deleteImageAction())
                .and()
                .withLocal()
                .source(OrderStatus.DES_AWAIT_CUST_APPROVAL).target(OrderStatus.DES_CUST_APPROVAL_PROCESS)
                .event(OrderEvent.DES_CUST_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.DES_CUST_APPROVAL_PROCESS)
                .first(OrderStatus.DES_CUST_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.DES_CUST_DECLINED)
                .and()
                .withLocal()
                .source(OrderStatus.DES_CUST_DECLINED).target(OrderStatus.IN_DESIGNING)
                .event(OrderEvent.DES_CUST_DECLINE)

                /*------------------------------------------------------------------------------------------------*/
                /*------------------------------------------------------------------------------------------------*/

                .and()
                .withExternal()
                .source(OrderStatus.DES_CUST_APPROVED).target(OrderStatus.IN_PRODUCTION)
                .event(OrderEvent.DES_CUST_APPROVE)
                .action(actionAndGuardConfiguration.notifyProductionStaffAction())

                /*------------------------------------------------------------------------------------------------------*/
                /*--------------------------------PRODUCTION SUPERSTATE LOCAL TRANSITION--------------------------------*/

                .and()
                .withLocal()
                .source(OrderStatus.IN_PRODUCTION).target(OrderStatus.PRO_AWAIT_APPROVAL)
                .event(OrderEvent.PRO_FINISH)
                .action(actionAndGuardConfiguration.notifyCustomerApprovalAction())
                .and()
                .withLocal()
                .source(OrderStatus.PRO_AWAIT_APPROVAL).target(OrderStatus.PRO_APPROVAL_PROCESS)
                .event(OrderEvent.PRO_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.PRO_APPROVAL_PROCESS)
                .first(OrderStatus.PRO_APPROVED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.PRO_DECLINED)
                .and()
                .withLocal()
                .source(OrderStatus.PRO_DECLINED).target(OrderStatus.IN_PRODUCTION)
                .event(OrderEvent.PRO_DECLINE)

                /*------------------------------------------------------------------------------------------------*/
                /*------------------------------------------------------------------------------------------------*/

                .and()
                .withExternal()
                .source(OrderStatus.PRO_APPROVED).target(OrderStatus.ON_DELIVERING)
                .event(OrderEvent.PRO_APPROVE)

                /*-----------------------------------------------------------------------------------------------------*/
                /*--------------------------------TRANSPORT SUPERSTATE LOCAL TRANSITION--------------------------------*/

                .and()
                .withLocal()
                .source(OrderStatus.ON_DELIVERING).target(OrderStatus.DELIVERED_AWAIT_APPROVAL)
                .event(OrderEvent.DELIVERED)
                .action(actionAndGuardConfiguration.notifyDeliveredAction())
                .and()
                .withLocal()
                .source(OrderStatus.DELIVERED_AWAIT_APPROVAL).target(OrderStatus.DELIVERED_APPROVAL_PROCESS)
                .event(OrderEvent.DELIVERED_PROCESS)
                .and()
                .withChoice()
                .source(OrderStatus.DELIVERED_APPROVAL_PROCESS)
                .first(OrderStatus.DELIVERED_CONFIRMED, actionAndGuardConfiguration.checkApprovalGuard())
                .last(OrderStatus.DELIVERED_DENIED)
                .and()
                .withLocal()
                .source(OrderStatus.DELIVERED_DENIED).target(OrderStatus.ON_DELIVERING)
                .event(OrderEvent.DELIVERED_DENY)

                /*------------------------------------------------------------------------------------------------*/
                /*------------------------------------------------------------------------------------------------*/
                .and()
                .withExternal()
                .source(OrderStatus.DELIVERED_CONFIRMED).target(OrderStatus.ORDER_COMPLETED)
                .event(OrderEvent.DELIVERED_APPROVE)
        ;

        configureCancelTransition(transitions, OrderStatus.values());
    }

    private void configureCancelTransition(
            StateMachineTransitionConfigurer<OrderStatus, OrderEvent> transitions,
            OrderStatus[] statuses
    ) throws Exception {
        for (OrderStatus status : statuses) {
            if (status != OrderStatus.CANCEL) {
                transitions
                        .withExternal()
                        .source(status)
                        .target(OrderStatus.CANCEL)
                        .event(OrderEvent.CANCEL)
                        .action(actionAndGuardConfiguration.notifyCancelAction());
            }
        }
    }
}
