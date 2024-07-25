package com.swp391.JewelryProduction.security.model;

import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.repositories.AccountRepository;
import com.swp391.JewelryProduction.repositories.UserInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final static Logger logger = LoggerFactory.getLogger(UserRepositoryImpl.class);

    private final AccountRepository accRepo;
    private final UserInfoRepository userInfoRepo;

    @Override
    public Optional<User> findByEmail(String email) {
        User user = new User();
        Account foundUser = null;
        UserInfo userInfo = null;
        try {
            foundUser = accRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("No account found"));
            user.setAccount(foundUser);
            userInfo = userInfoRepo.findById(foundUser.getId()).orElse(new UserInfo());
            user.setUserInfo(userInfo);
        } catch (NullPointerException e) {
            logger.warn(e.getMessage());
        }

        return Optional.of(user);
    }

    @Override
    public void save(User user) {
        try {
            accRepo.save(user.getAccount());
            if (user.getUserInfo() == null) throw new NullPointerException();
            userInfoRepo.save(user.getUserInfo());
        } catch (NullPointerException e) {
            logger.warn("Account or UserInfo is null");
        }
    }
}
