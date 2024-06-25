package com.swp391.JewelryProduction.services.account;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.repositories.AccountRepository;
import com.swp391.JewelryProduction.repositories.UserInfoRepository;
import com.swp391.JewelryProduction.security.model.User;
import com.swp391.JewelryProduction.util.exceptions.ObjectExistsException;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserInfoRepository infoRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserInfoRepository userInfoRepository;

    //<editor-fold desc="GET METHODS" defaultstate="collapsed">
    @Override
    public List<Account> findAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account findAccountByEmail(String email) {
        return accountRepository
                .findByEmail(email)
                .orElseThrow(() -> new ObjectNotFoundException("Account with email " + email + " not found"));
    }

    @Override
    public Account findAccountById(String accountId) {
        return accountRepository
                .findById(accountId)
                .orElseThrow(() -> new ObjectNotFoundException("Account with id " + accountId + " does not exist"));
    }

    @Override
    public Account findAccountByEmailAndPassword(String email, String password) {
        Account acc = accountRepository.findByEmail(email).orElse(null);
        if (acc == null || !passwordEncoder.matches(password, acc.getPassword()))
            return null;

        return acc;
    }

    @Override
    public UserInfo findInfoById(String id) {
        return infoRepository.findById(id).orElse(null);
    }

    @Override
    public UserInfo findInfoByEmail(String email) {
        Account acc = accountRepository.findByEmail(email).orElse(null);
        if (acc == null) return null;
        return infoRepository.findById(acc.getId()).orElse(null);
    }

    @Override
    public Account findAccountByRole(Role role) {
        return accountRepository.findAccountByRole(role).isPresent() ?  accountRepository.findAccountByRole(role).get() : null;
    }

//    @Override
//    public List<Account> findAllByRole(Role role) {
//        return accountRepository.findAllByRole(role);
//    }
    //</editor-fold>

    //<editor-fold desc="UPDATE METHODS" defaultstate="collapsed">
    @Transactional
    @Override
    public Account updateAccountPassword(AccountDTO accountDTO) {
        Account updatedAcc = accountRepository.findByEmail(accountDTO.getEmail()).orElseThrow(() -> new ObjectNotFoundException("Account with email "+accountDTO.getEmail()+" does not exist"));
        log.info("Old Password: " +updatedAcc.getPassword());
        String.format("Old password: %s \nNew Password: %s", updatedAcc.getPassword(), accountDTO.getPassword());

        updatedAcc.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
        return accountRepository.save(updatedAcc);
    }

    @Transactional
    @Override
    public Account updateAccountStatusActive(String email) {
        Account acc = accountRepository.findByEmail(email).orElse(null);
        if (acc == null) return null;
        acc.setStatus(AccountStatus.ACTIVE);
        return accountRepository.save(acc);
    }


    //</editor-fold>

    //<editor-fold desc="SAVE METHODS" defaultstate="collapsed">
    @Transactional
    @Override
    public void saveAccountPassword(AccountDTO accountDTO, String newPassword) {
        accountDTO.setPassword(newPassword);
        accountRepository.save(modelMapper.map(accountDTO, Account.class));
    }

    @Transactional
    @Override
    public Account saveAccountIfNew(AccountDTO accountDTO) {
        Account acc = accountRepository.findByEmail(accountDTO.getEmail()).orElse(null);
        if (acc != null && acc.getStatus().equals(AccountStatus.LOCKED)) {
            if (passwordEncoder.matches(accountDTO.getPassword(), acc.getPassword()))
                return acc;
            else
                return null;
        } else if (acc != null)
            return null;

        UserInfo info = new UserInfo();
        acc = Account.builder()
                .email(accountDTO.getEmail())
                .password(passwordEncoder.encode(accountDTO.getPassword()))
                .role(Role.CUSTOMER)
                .status(AccountStatus.LOCKED)
                .dateCreated(LocalDateTime.now())
                .userInfo(info)
                .build();
        info.setAccount(acc);
        return accountRepository.save(acc);
    }

    @Transactional
    @Override
    public Account saveUserInfo(UserInfo newInfo, String email) {
        Account acc = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ObjectNotFoundException("Account with email " + email + " cannot be found, cannot update info"));
        mappedNewValueUserInfo(acc.getUserInfo(), newInfo);
        return accountRepository.save(acc);
    }

    private void mappedNewValueUserInfo (UserInfo oldUI, UserInfo newUI) {
        oldUI.setGender(newUI.getGender());
        oldUI.setFirstName(newUI.getFirstName());
        oldUI.setLastName(newUI.getLastName());
        oldUI.setBirthDate(newUI.getBirthDate());
        oldUI.setPhoneNumber(newUI.getPhoneNumber());
        oldUI.setAddress(newUI.getAddress());
    }
    //</editor-fold>

    //<editor-fold desc="DELETE METHODS" defaultstate="collapsed">
//    @Transactional
//    @Override
//    public void deleteAccount(String accountID) {
//        Account acc = accountRepository.findById(accountID).orElseThrow(() -> new ObjectNotFoundException("Account with id " + accountID + " not found, can't be deleted"));
//        accountRepository.delete(acc);
//    }

    @Override
    public boolean checkCurrentOrderExist(String accountId) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new ObjectNotFoundException("Account with id "+accountId+" does not exist."));
        return acc.getCurrentOrder() != null;
    }
    //</editor-fold>

    //<editor-fold desc="ADMIN" defaultstate="collapsed">
    @Override
    public Page<Account> findAllByRole(Role role, int offset) {
        return accountRepository.findAllByRole(role, PageRequest.of(offset, 5));
    }

    @Transactional
    @Override
    public Account createAccount(AccountDTO accountDTO) {
        if(accountRepository.findByEmail(accountDTO.getEmail().toLowerCase()).isPresent())
            throw new RuntimeException("Email is already existed.");
        return accountRepository.save(setAccount(accountDTO));
    }

    @Transactional
    @Override
    public Account updateAccount(AccountDTO accountDTO) {
        List<Account> list = accountRepository.findAllByEmail(accountDTO.getEmail());
        if (list.isEmpty() || list.stream().anyMatch(account -> account.getId().equals(accountDTO.getId())))
            return accountRepository.save(setAccount(accountDTO));
        else
            throw new ObjectExistsException("Account with email " + accountDTO.getEmail() + " already exists");
    }

    @Transactional
    @Override
    public void deleteAccount(String accountId) {
        accountRepository.delete(accountRepository.findById(accountId).orElseThrow(() -> new ObjectNotFoundException("Account with id " + accountId + " not found")));
    }

    public Account setAccount(AccountDTO accountDTO) {
        Account account = Account.builder()
                .id(accountDTO.getId())
                .dateCreated(accountDTO.getDateCreated())
                .status(accountDTO.getStatus())
                .email(accountDTO.getEmail().toLowerCase())
                .password(passwordEncoder.encode(accountDTO.getPassword()))
                .role(accountDTO.getRole())
                .build();
        if(accountDTO.getUserInfo() != null) {
            account.setUserInfo(UserInfo.builder()
                    .address(accountDTO.getUserInfo().getAddress())
                    .account(account)
                    .phoneNumber(accountDTO.getUserInfo().getPhoneNumber())
                    .gender(accountDTO.getUserInfo().getGender())
                    .lastName(accountDTO.getUserInfo().getLastName())
                    .firstName(accountDTO.getUserInfo().getFirstName())
                    .id(account.getId())
                    .birthDate(accountDTO.getUserInfo().getBirthDate())
                    .build());
        } else {
            account.setUserInfo(UserInfo.builder()
                    .id(account.getId())
                    .build());
        }
        return account;
    }

    //</editor-fold>
}
