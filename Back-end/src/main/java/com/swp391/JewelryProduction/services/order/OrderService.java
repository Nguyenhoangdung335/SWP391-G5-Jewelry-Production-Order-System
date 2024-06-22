package com.swp391.JewelryProduction.services.order;

import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.pojos.Order;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<Order> findAllOrders();
    Order saveNewOrder(String accountId);
    Order findOrderById(String id);
    Order updateOrder(Order order);
    Order AssignStaff (String orderID, StaffGroup staffs);
}
