package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {
}
