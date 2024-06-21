package com.swp391.JewelryProduction.repositories;

import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {
    List<Staff> findAllByRole(Role role);
    Optional<Staff> findStaffById(String staffId);
}
