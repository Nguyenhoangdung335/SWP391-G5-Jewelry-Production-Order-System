package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.pojos.gemstone.ClarityMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClarityMultiplierRepository extends JpaRepository<ClarityMultiplier, Long> {
    Optional<ClarityMultiplier> findByClarity (GemstoneClarity clarity);
}
