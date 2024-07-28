package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Integer> {
    @EntityGraph(attributePaths = {"product.orders"})
    @NotNull
    @Override
    Optional<ProductSpecification> findById(@NotNull Integer integer);
    boolean existsByMetalId(long metalId);
}
