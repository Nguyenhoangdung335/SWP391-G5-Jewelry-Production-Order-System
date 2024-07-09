package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.repositories.OrderRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getStateMachine;
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.instantiateStateMachine;

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
        Account owner = modelMapper.map(accountService.findAccountById(accountId), Account.class);

        Order order = Order.builder()
                .status(OrderStatus.REQUESTING)
                .owner(owner)
                .createdDate(LocalDateTime.now())
                .relatedReports(new LinkedList<>())
                .notifications(new LinkedList<>())
                .staffOrderHistory(new LinkedList<>())
                .build();
        owner.setCurrentOrder(order);
        order = orderRepository.save(order);
        instantiateStateMachine(order, this, stateMachineService);

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
    public Order assignStaff(String orderId, StaffGroup staffs) {
        Order order = this.findOrderById(orderId);
        order.setSaleStaff(
                staffService.findStaffByIdWithRole(
                        staffs.getSaleStaffID(), Role.SALE_STAFF
                )
        );
        order.setDesignStaff(
                staffService.findStaffByIdWithRole(
                        staffs.getDesignStaffID(), Role.DESIGN_STAFF
                )
        );
        order.setProductionStaff(
                staffService.findStaffByIdWithRole(
                        staffs.getProductionStaffID(), Role.PRODUCTION_STAFF
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

    //<editor-fold desc="ADMIN" defaultstate="collapsed>
    @Override
    public Page<Order> findAll(int offset) {
        return orderRepository.findAll(PageRequest.of(offset, 5));
    }

    @Transactional
    @Override
    public Order updateOrder(OrderDTO orderDTO) {
        return orderRepository.save(setOrder(orderDTO));
    }

    @Transactional
    @Override
    public void deleteOrder(String orderId) {
        orderRepository.delete(orderRepository.findById(orderId).orElseThrow(() -> new ObjectNotFoundException("Order not found")));
    }

    @Override
    public double calculateTotalRevenueMonthly(int month) {
        long totalRevenue = 0;
        for(Order order : orderRepository.findAllByMonthAndYear(month, 2024)) {
            totalRevenue += order.getBudget();
        };
        return totalRevenue;
    }

    @Override
    public List<Order> findOrderByAccountId(String accountId) {
        return orderRepository.findAllByOwnerId(accountId);
    }

    public Order setOrder(OrderDTO orderDTO) {
        Order order = Order.builder()
                .id(orderDTO.getId())
                .budget(orderDTO.getBudget())
                .createdDate(orderDTO.getCreatedDate())
                .name(orderDTO.getName())
                .status(orderDTO.getStatus())
                .build();
        if(orderDTO.getProduct() != null) {
            order.setProduct(Product.builder()
                            .id(orderDTO.getProduct().getId())
                            .name(orderDTO.getProduct().getName())
                            .description(orderDTO.getProduct().getDescription())
                            .order(order)
                    .build());
        }
        if(orderDTO.getQuotation() != null) {
            order.setQuotation(Quotation.builder()
                    .id(orderDTO.getQuotation().getId())
                    .title(orderDTO.getQuotation().getTitle())
                    .createdDate(orderDTO.getQuotation().getCreatedDate())
                    .expiredDate(orderDTO.getQuotation().getExpiredDate())
                    .build());
        }
        if(orderDTO.getDesign() != null) {
            order.setDesign(Design.builder()
                    .id(orderDTO.getDesign().getId())
                    .designLink(orderDTO.getDesign().getDesignLink())
                    .lastUpdated(orderDTO.getDesign().getLastUpdated())
                    .build());
        }
        return order;
    }
    //</editor-fold>

}