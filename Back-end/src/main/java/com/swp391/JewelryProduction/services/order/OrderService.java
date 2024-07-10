package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.dto.ResponseDTOs.OrderResponse;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Order;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();

    Page<Order> findOrdersByPageAndStatusBasedOnRole (String accountId, Role role, OrderStatus orderStatus, int offset, int pageSize);

    Order saveNewOrder(String accountId);
    Order findOrderById(String id);
    Order updateOrder(Order order);
    Order assignStaff(String orderID, StaffGroup staffs);
    Page<Order> findAll(int offset, int elementsPerPage);
    Page<Order> findAll(int offset);
    Order updateOrder(OrderDTO orderDTO);
    void deleteOrder(String orderId);
    List<Order> findOrderByAccountId (String accountId);
    Long countAllOrders ();

    double calculateTotalRevenueMonthly(int month);

    Order findLatestUncompletedOrderByStaffAndRole(String staffId, Role role);

    OrderResponse mappedToResponse (Order order);
}
