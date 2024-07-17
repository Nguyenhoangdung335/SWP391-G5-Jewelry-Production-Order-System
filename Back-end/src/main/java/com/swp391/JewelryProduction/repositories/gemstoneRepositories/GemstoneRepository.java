package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.pojos.gemstone.Gemstone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GemstoneRepository extends JpaRepository<Gemstone, Long> {
}
