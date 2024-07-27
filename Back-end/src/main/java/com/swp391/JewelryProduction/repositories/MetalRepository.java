package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MetalRepository extends JpaRepository<Metal, Long> {
    Optional<Metal> findByNameAndUnit(String name, String unit);

    @Query("SELECT m FROM Metal m WHERE " +
            "(:name IS NULL OR m.name LIKE %:name%) AND " +
            "(:unit IS NULL OR m.unit LIKE %:unit%) ")
    List<Metal> findMetalsByNameAndUnit(
            @Param("name") String name,
            @Param("unit") String unit
    );
}
