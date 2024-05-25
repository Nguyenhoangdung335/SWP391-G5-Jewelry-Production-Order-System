package com.swp391.JewleryProduction.services.order;

import com.swp391.JewleryProduction.dto.OrderDTO;

import java.util.List;

public interface IOrderService {
    List<OrderDTO> findAllOrders();
}
