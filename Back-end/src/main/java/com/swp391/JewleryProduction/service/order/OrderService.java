package com.swp391.JewleryProduction.services.order;

import com.swp391.JewleryProduction.dto.OrderDTO;
import com.swp391.JewleryProduction.pojos.Order;
import com.swp391.JewleryProduction.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService {
    private OrderRepository orderRepository;
    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<OrderDTO> findAllOrders() {
        return orderRepository.findAll().stream().map(order -> mapToOrderDTO(order)).collect(Collectors.toList());
    }

    private OrderDTO mapToOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .budget(order.getBudget())
                .name(order.getName())
                .createdDate(order.getCreatedDate())
                .design(order.getDesign())
                .quotation(order.getQuotation())
                .build();
    }
}
