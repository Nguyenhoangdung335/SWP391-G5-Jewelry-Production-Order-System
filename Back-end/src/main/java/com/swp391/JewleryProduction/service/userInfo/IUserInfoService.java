package com.swp391.JewleryProduction.services.userInfo;

import com.swp391.JewleryProduction.dto.UserInfoDTO;

import java.util.List;

public interface IUserInfoService {
    List<UserInfoDTO> findAllUserInfos();
}
