package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.dto.ResponseDTOs.OrderResponse;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order saveNewOrder(String accountId);
    Order findOrderById(String id);
    Order updateOrder(Order order);
    Order assignStaff(String orderID, StaffGroup staffs);
    Page<Order> findAll(int offset);
    Order updateOrder(OrderDTO orderDTO);
    void deleteOrder(String orderId);
    List<Order> findOrderByAccountId (String accountId);
    double calculateTotalRevenueMonthly(int month);

    OrderResponse mappedToResponse (Order order);
    Order findOrderByProductId(String productId);
}
