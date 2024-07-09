package com.swp391.JewelryProduction.security.services;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.RegistrationRequest;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.security.model.User;
import com.swp391.JewelryProduction.security.model.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;

    private final Integer EXPIRE_MINS = 2;
    private final LoadingCache<String, String> otpCache = CacheBuilder
            .newBuilder()
            .expireAfterWrite(EXPIRE_MINS, TimeUnit.MINUTES)
            .build(new CacheLoader<String, String>() {
                @Override
                public String load(String key) throws Exception {
                    return "";
                }
            });

    public String register(AccountDTO accountDTO) {
        var user = User.builder()
                .account(modelMapper.map(accountDTO, Account.class))
                .userInfo(new UserInfo())
                .build();
        user.getAccount().setPassword(passwordEncoder.encode(user.getPassword()));
        logger.info(user.toString());

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getAccount().getId());
        claims.put("first_name", user.getUserInfo().getFirstName());
        claims.put("role", user.getAccount().getRole());
        claims.put("status", user.getAccount().getStatus());
        return jwtService.generateToken(claims, user);
    }

    public String authenticate(RegistrationRequest request) {
        var test = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("No user found"));
        log.info(request.getPassword() + ": " + passwordEncoder.encode(request.getPassword()) + " and " + test.getPassword() + ": " +passwordEncoder.matches(request.getPassword(), test.getPassword()));

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("No user found"));
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getAccount().getId());
        claims.put("first_name", user.getUserInfo().getFirstName());
        claims.put("role", user.getAccount().getRole());
        claims.put("status", user.getAccount().getStatus());

        return jwtService.generateToken(claims, user);
    }

    public String generateOTP (String emailKey) {
        Random rand = new Random();
        StringBuilder otp = new StringBuilder(String.valueOf(rand.nextInt(999999)));
        while (otp.length() < 6) {
            otp.insert(0, "0");
        }
        otpCache.put(emailKey, otp.toString());
        return otp.toString();
    }

    public boolean verifyOTP (String emailKey, String otp) {
        String savedOTP = otpCache.getIfPresent(emailKey);
//        if (savedOTP == null) throw new RuntimeException("Your OTP have been expired, please re-send it again");
        boolean isVerified = savedOTP != null && savedOTP.equals(otp);
        if (isVerified)
            otpCache.invalidate(emailKey);
        return isVerified;
    }
}
