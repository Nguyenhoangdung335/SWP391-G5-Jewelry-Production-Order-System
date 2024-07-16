package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialRepository extends JpaRepository<MetalPrice, Long> {
    Optional<MetalPrice> findByName(String name);
}
