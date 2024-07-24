package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GemstoneRepository extends JpaRepository<Gemstone, Long> {
    Page<Gemstone> getAllByActiveIsTrue(Pageable pageable);
}
