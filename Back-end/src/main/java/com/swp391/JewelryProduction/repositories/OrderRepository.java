package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Order;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    @NotNull
    @EntityGraph( attributePaths = {"staffOrderHistory", "quotation", "design", "product", "transactions", "warranty"} )
    @Override
    Optional<Order> findById(@NotNull String s);

    @Query(value = "SELECT * FROM Orders WHERE MONTH(date_created) = :month AND YEAR(date_created) = :year", nativeQuery = true)
    List<Order> findAllByMonthAndYear(@Param("month") int month, @Param("year") int year);
}
