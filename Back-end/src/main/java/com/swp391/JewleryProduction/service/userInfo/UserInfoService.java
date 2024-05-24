package com.swp391.JewleryProduction.services.userInfo;

import com.swp391.JewleryProduction.dto.UserInfoDTO;
import com.swp391.JewleryProduction.pojos.UserInfo;
import com.swp391.JewleryProduction.repositories.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class UserInfoService implements IUserInfoService{
    private UserInfoRepository userInfoRepository;

    @Autowired
    public UserInfoService(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public List<UserInfoDTO> findAllUserInfos() {
        return userInfoRepository.findAll().stream().map(userInfo -> mapToUserInfoDTO(userInfo)).collect(Collectors.toList());
    }
    private UserInfoDTO mapToUserInfoDTO(UserInfo userInfo) {
        return UserInfoDTO.builder()
                .id(userInfo.getId())
                .account(userInfo.getAccount())
                .address(userInfo.getAddress())
                .gender(userInfo.getGender())
                .firstName(userInfo.getFirstName())
                .lastName(userInfo.getLastName())
                .phoneNumber(userInfo.getPhoneNumber())
                .birthDate(userInfo.getBirthDate())
                .build();
    }
}
