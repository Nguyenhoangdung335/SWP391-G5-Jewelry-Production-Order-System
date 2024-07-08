package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.pojos.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transactions, Integer> {
    Optional<Transactions> findByPaypalPaymentId (String paypalPaymentId);
}
