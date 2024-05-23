package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
}
