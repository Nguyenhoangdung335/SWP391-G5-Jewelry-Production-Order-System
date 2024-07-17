package com.swp391.JewelryProduction.repositories.gemstoneRepositories;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.pojos.gemstone.CutMultiplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CutMultiplierRepository extends JpaRepository<CutMultiplier, Long> {
    Optional<CutMultiplier> findByCutQuality (GemstoneCut cutQuality);
}
