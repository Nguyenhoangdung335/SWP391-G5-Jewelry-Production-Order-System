package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    Account findAccountByEmailAndPassword(String email, String password);
    boolean findAccountByEmail(String email);
    Account findByEmail(String email);
}