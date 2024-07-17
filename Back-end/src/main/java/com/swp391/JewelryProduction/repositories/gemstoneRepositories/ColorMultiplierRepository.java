package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.pojos.gemstone.ColorMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ColorMultiplierRepository extends JpaRepository<ColorMultiplier, Long> {
    Optional<ColorMultiplier> findByColor (GemstoneColor color);
}
