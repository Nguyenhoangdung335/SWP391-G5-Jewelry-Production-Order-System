package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MetalRepository extends JpaRepository<Metal, Long> {
    Optional<Metal> findByNameAndUnit(String name, String unit);
}
