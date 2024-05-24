package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {
}
