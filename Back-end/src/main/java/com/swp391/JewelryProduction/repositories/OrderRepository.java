package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Order;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    @NotNull
    @EntityGraph( attributePaths = {"owner.userInfo", "staffOrderHistory.staff", "quotation.quotationItems", "design", "product.specification", "transactions", "warranty"} )
    @Override
    Optional<Order> findById(@NotNull String s);

    @NotNull
    @Override
    @EntityGraph( attributePaths = {"owner.userInfo", "staffOrderHistory.staff", "quotation.quotationItems", "design", "product.specification", "transactions", "warranty"} )
    List<Order> findAll();

    @Query(value = "SELECT o FROM Order o WHERE MONTH(o.createdDate) = :month AND YEAR(o.createdDate) = :year")
    List<Order> findAllByMonthAndYear(@Param("month") int month, @Param("year") int year);
    List<Order> findAllByOwnerId (String ownerId);
    Optional<Order> findByProductId (String productId);

    @Query("SELECT o FROM Order o " +
            "JOIN o.staffOrderHistory soh " +
            "WHERE soh.staff.id = :staffId " +
            "AND soh.staff.role = :role " +
            "AND o.status <> com.swp391.JewelryProduction.enums.OrderStatus.ORDER_COMPLETED " +
            "ORDER BY o.createdDate DESC")
    Page<Order> findLatestUncompletedOrderByStaffAndRole(@Param("staffId") String staffId, @Param("role") Role role, PageRequest request);

    @Query("SELECT o FROM Order o " +
            "JOIN o.staffOrderHistory soh " +
            "WHERE soh.staff.id = :staffId " +
            "AND soh.staff.role = :role " +
            "AND o.status = :status " +
            "ORDER BY o.createdDate DESC")
    Page<Order> findAllByOrderByStaffAndStatus (@Param("staffId") String staffId, @Param("role") Role role, @Param("status") OrderStatus status, PageRequest request);

    @Query("SELECT o FROM Order o " +
            "JOIN o.staffOrderHistory soh " +
            "WHERE soh.staff.id = :staffId " +
            "AND soh.staff.role = :role " +
            "ORDER BY o.createdDate DESC")
    Page<Order> findAllAssignedOrderByStaffAndRole (@Param("staffId") String staffId, @Param("role") Role role, PageRequest request);

    Page<Order> findAllByStatus (OrderStatus status, PageRequest request);
    Page<Order> findAllByStatusNot (OrderStatus status, PageRequest request);
}
