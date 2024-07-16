package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MetalPriceRepository extends JpaRepository<MetalPrice, Long> {
    Optional<MetalPrice> findByNameAndUnit(String name, String unit);
}
