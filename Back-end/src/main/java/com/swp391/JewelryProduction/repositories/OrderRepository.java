package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
}
