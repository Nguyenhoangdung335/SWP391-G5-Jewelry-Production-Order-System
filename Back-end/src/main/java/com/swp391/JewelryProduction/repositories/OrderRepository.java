package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Order;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    @NotNull
    @EntityGraph( attributePaths = {"staffOrderHistory"} )
    @Override
    Optional<Order> findById(@NotNull String s);
}
