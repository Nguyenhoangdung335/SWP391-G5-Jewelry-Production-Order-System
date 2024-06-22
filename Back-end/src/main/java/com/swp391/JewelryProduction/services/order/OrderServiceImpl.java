package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.repositories.OrderRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import static com.swp391.JewelryProduction.util.StateMachineUtil.getStateMachine;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final AccountService accountService;
    private final StaffService staffService;
    private final ModelMapper modelMapper;

    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    @Override
    public List<Order> findAllOrders() {
        return orderRepository.findAll().stream().toList();
    }

    @Override
    public Order saveNewOrder(String accountId) {
        Order order = Order.builder()
                .status(OrderStatus.REQUESTING)
                .owner(modelMapper.map(accountService.findAccountById(accountId), Account.class))
                .createdDate(LocalDateTime.now())
                .relatedReports(new LinkedList<>())
                .notifications(new LinkedList<>())
                .staffOrderHistory(new LinkedList<>())
                .build();
        order = orderRepository.save(order);

        return order;
    }

    @Transactional
    @Override
    public Order findOrderById(String id) {
        return orderRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Order not found"));
    }

    @Override
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order AssignStaff(String orderId, StaffGroup staffs) {
        Order order = this.findOrderById(orderId);
        order.setSaleStaff(
                staffService.findStaffById(
                        staffs.getSaleStaffID()
                )
        );
        order.setDesignStaff(
                staffService.findStaffById(
                        staffs.getSaleStaffID()
                )
        );
        order.setProductionStaff(
                staffService.findStaffById(
                        staffs.getSaleStaffID()
                )
        );
        order = this.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId, stateMachineService);
        stateMachine.sendEvent(
                Mono.just(MessageBuilder.
                        withPayload(OrderEvent.ASSIGN_STAFF)
                        .build()
                )
        ).subscribe();

        return order;
    }
}