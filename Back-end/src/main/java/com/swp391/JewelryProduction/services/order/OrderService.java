package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.pojos.Order;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order saveNewOrder(String accountId);
    Order findOrderById(String id);
    Order updateOrder(Order order);
    Order assignStaff(String orderID, StaffGroup staffs);
}
