package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.pojos.gemstone.GemstoneType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GemstoneTypeRepository extends JpaRepository<GemstoneType, Long> {
    Optional<GemstoneType> findByName (String name);

    List<GemstoneType> findAllByStatusTrue();
}
