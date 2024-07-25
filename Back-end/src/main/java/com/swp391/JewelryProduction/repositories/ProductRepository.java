package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findAllBySpecificationId(Integer specificationId);

    @Query("SELECT p FROM Product p JOIN FETCH p.specification")
    @NotNull
    @Override
    List<Product> findAll();

    @EntityGraph(attributePaths = {"specification.metal", "specification.gemstone"})
    @NotNull
    Page<Product> findAll(@NotNull Pageable pageable);

    @EntityGraph(attributePaths = {"specification.metal", "specification.gemstone"})
    Page<Product> findAllByOrderStatusIs (@NotNull Pageable pageable, OrderStatus status);

    @Query("SELECT p FROM Product p JOIN FETCH p.specification WHERE p.id = :id")
    @NotNull
    @EntityGraph(attributePaths = {"specification"})
    @Override
    Optional<Product> findById(@NotNull @Param("id") String id);

    @EntityGraph(attributePaths = {"order", "specification"})
    List<Product> findAllByOrderByIdDesc(Limit limit);
}
