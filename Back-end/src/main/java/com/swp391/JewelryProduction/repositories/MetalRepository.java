package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MetalRepository extends JpaRepository<Metal, Long> {
    Optional<Metal> findByNameAndUnit(String name, String unit);

    @Query("SELECT m FROM Metal m " +
            "WHERE (:name LIKE %:name%) AND " +
            "(:unit LIKE %:unit%)" +
            "ORDER BY m.marketPrice ASC, m.companyPrice ASC ")
    List<Metal> findAllByNameAndUnit(@Param("name") String name,@Param("unit") String unit);


    @Query("SELECT m FROM Metal m WHERE " +
            "m.name LIKE CONCAT('%', :name, '%') AND " +
            "m.unit LIKE CONCAT('%', :unit, '%') AND " +
            "((m.companyPrice BETWEEN :companyPrice - 10 AND :companyPrice + 10) OR " +
            "(m.marketPrice BETWEEN :marketPrice - 10 AND :marketPrice + 10))")
    List<Metal> findBySearch(
            @Param("name") String name,
            @Param("unit") String unit,
            @Param("marketPrice") Double marketPrice,
            @Param("companyPrice") Double companyPrice
    );

    @Query("SELECT DISTINCT m.name FROM Metal m")
    List<String> findAllDistinctMetalName ();

    @Query("SELECT DISTINCT m.unit FROM Metal m")
    List<String> findAllDistinctMetalUnit();
}
