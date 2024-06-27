package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByName(String name);
}
