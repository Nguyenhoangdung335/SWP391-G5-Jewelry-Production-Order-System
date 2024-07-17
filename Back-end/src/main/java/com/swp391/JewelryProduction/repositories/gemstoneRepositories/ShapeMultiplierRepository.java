package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.gemstone.ShapeMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShapeMultiplierRepository extends JpaRepository<ShapeMultiplier, Long> {
    Optional<ShapeMultiplier> findByShape (GemstoneShape shape);
}
