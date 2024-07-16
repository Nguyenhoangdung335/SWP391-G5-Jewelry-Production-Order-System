package com.swp391.JewelryProduction.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.swp391.JewelryProduction.pojos.Price.GemstonePrice;

public interface GemstonePriceRepository extends JpaRepository<GemstonePrice, Integer> {
}
