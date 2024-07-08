package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    Optional<Warranty> findByOrderId(String orderId);
}
