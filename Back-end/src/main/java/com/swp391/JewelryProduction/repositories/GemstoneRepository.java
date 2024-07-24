package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GemstoneRepository extends JpaRepository<Gemstone, Long> {
    Page<Gemstone> getAllByActiveIsTrue(Pageable pageable);
    @Query("SELECT DISTINCT g.name FROM Gemstone g")
    List<String> getAllDistinctGemstoneName ();
    @Query("SELECT DISTINCT g.shape FROM Gemstone g")
    List<String> getAllDistinctGemstoneShape ();
    @Query("SELECT DISTINCT g.clarity FROM Gemstone g")
    List<String> getAllDistinctGemstoneClarity ();
    @Query("SELECT DISTINCT g.cut FROM Gemstone g")
    List<String> getAllDistinctGemstoneCut ();
    @Query("SELECT DISTINCT g.color FROM Gemstone g")
    List<String> getAllDistinctGemstoneColor ();
    @Query("SELECT MIN(g.caratWeightFrom) FROM Gemstone g")
    Optional<Double> findLowestCaratWeightFrom();
    @Query("SELECT MAX(g.caratWeightTo) FROM Gemstone g")
    Optional<Double> findHighestCaratWeightTo();


    @Query("SELECT g FROM Gemstone g WHERE " +
            "(:name IS NULL OR g.name = :name) AND " +
            "(:shape IS NULL OR g.shape = :shape) AND " +
            "(:clarity IS NULL OR g.clarity = :clarity) AND " +
            "(:color IS NULL OR g.color = :color) AND " +
            "(:cut IS NULL OR g.cut = :cut) AND " +
            "(:weight IS NULL OR g.caratWeightFrom <= :weight AND g.caratWeightTo >= :weight)")
    List<Gemstone> findGemstonesByRequest(
            @Param("name") String name,
            @Param("shape") GemstoneShape shape,
            @Param("clarity") GemstoneClarity clarity,
            @Param("color") GemstoneColor color,
            @Param("cut") GemstoneCut cut,
            @Param("weight") Double weight
    );
}
