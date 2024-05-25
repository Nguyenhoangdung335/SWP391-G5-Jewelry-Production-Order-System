package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
}
