package com.swp391.JewelryProduction.services.account;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.RegistrationRequest;
import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.repositories.AccountRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectExistsException;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    //<editor-fold desc="GET METHODS" defaultstate="collapsed">
    @Override
    public List<Account> findAllByRole(Role role) {
        return accountRepository.findAllByRoleIn(List.of(role));
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
    public Page<Account> findAllByRole(Role role, int offset, int elementsPerPage) {
        return accountRepository.findAllByRole(role, PageRequest.of(offset, elementsPerPage));
    }

    @Override
    public Page<Account> findAll(int offset, int elementPerPage) {
        return accountRepository.findAll(PageRequest.of(offset, elementPerPage));
    }
    //</editor-fold>

    //<editor-fold desc="UPDATE METHODS" defaultstate="collapsed">
    @Transactional
    @Override
    public Account updateAccountPassword(RegistrationRequest request) {
        Account updatedAcc = accountRepository.findByEmail(
                request.getEmail()).orElseThrow(
                        () -> new ObjectNotFoundException("Account with email "+request.getEmail()+" does not exist")
        );
        log.info("Old Password: " +updatedAcc.getPassword());

        updatedAcc.setPassword(passwordEncoder.encode(request.getPassword()));
        return accountRepository.save(updatedAcc);
    }

    @Transactional
    @Override
    public void updateAccountStatusActive(String email) {
        Account acc = accountRepository.findByEmail(email).orElseThrow(
                () -> new ObjectNotFoundException("Account with email "+email+" does not exist")
        );
        acc.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(acc);
    }

    @Override
    public Account updateAccount(Account account) {
        return accountRepository.save(account);
    }

    @Transactional
    @Override
    public Account updateAccount(AccountDTO accountDTO) {
        List<Account> list = accountRepository.findAllByEmail(accountDTO.getEmail());
        if (list.isEmpty() || list.stream().anyMatch(account -> account.getId().equals(accountDTO.getId()))) {
            // Fetch the existing account from the database
            Account existingAccount = accountRepository.findById(accountDTO.getId())
                    .orElseThrow(() -> new ObjectNotFoundException("Account not found"));

            // Check if the password is changed
            if (accountDTO.getPassword() == null) {
                accountDTO.setPassword(existingAccount.getPassword());
            } else if (!existingAccount.getPassword().equals(accountDTO.getPassword())) {
                System.out.println("Is not matched");
                // Encode the new password
                accountDTO.setPassword(passwordEncoder.encode(accountDTO.getPassword()));
            } else {
                System.out.println("Is matched");
                // Retain the old password
                accountDTO.setPassword(existingAccount.getPassword());
            }

            // Save the updated account
            return accountRepository.save(setAccount(accountDTO));
        } else {
            throw new ObjectExistsException("Account with email " + accountDTO.getEmail() + " already exists");
        }
    }
    //</editor-fold>

    //<editor-fold desc="SAVE METHODS" defaultstate="collapsed">\
    @Transactional
    @Override
    public Account saveAccountIfNew(RegistrationRequest request) {
        Account acc = accountRepository.findByEmail(request.getEmail()).orElse(null);
        if (acc != null && acc.getStatus().equals(AccountStatus.LOCKED)) {
            if (passwordEncoder.matches(request.getPassword(), acc.getPassword()))
                return acc;
            else
                return null;
        } else if (acc != null)
            return null;

        UserInfo info = new UserInfo();
        acc = Account.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
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
        acc.getUserInfo().copyValue(newInfo);
        return accountRepository.save(acc);
    }

    @Transactional
    @Override
    public Account createAccount(AccountDTO accountDTO) {
        if(accountRepository.findByEmail(accountDTO.getEmail()).isPresent())
            throw new ObjectExistsException("Email is already existed.");
        return accountRepository.save(setAccount(accountDTO));
    }
    //</editor-fold>

    //<editor-fold desc="DELETE METHODS" defaultstate="collapsed">
    @Transactional
    @Override
    public void deleteAccount(String accountId) {
        Account deletingAccount = accountRepository.findById(accountId).orElseThrow(
                () -> new ObjectNotFoundException("Account with id " + accountId + " not found")
        );
        deletingAccount.getPastOrder().forEach(order -> {
            order.setOwner(null);
        });
        deletingAccount.setPastOrder(null);
        deletingAccount = accountRepository.save(deletingAccount);

        accountRepository.delete(deletingAccount);
    }
    //</editor-fold>

    //<editor-fold desc="UTILITIES METHODS" defaultstate="collapsed">
    @Override
    public boolean checkCurrentOrderExist(String accountId) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new ObjectNotFoundException("Account with id "+accountId+" does not exist."));
        return acc.getCurrentOrder() != null;
    }

    @Override
    public Long countAllAccountByRole(List<Role> role) {
        return accountRepository.countAllByRoleIn(role);
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
