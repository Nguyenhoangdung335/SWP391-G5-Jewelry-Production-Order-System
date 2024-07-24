package com.swp391.JewelryProduction.services.account;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.RegistrationRequest;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface AccountService {
    Page<Account> findAllByRole(Role role, int offset, int elementsPerPage);
    Page<Account> findAll(int offset, int elementPerPage);

    List<Account> findAllByRole(Role role);

    Account findAccountById(String accountId);
    Account findAccountByEmail(String email);

    Account saveAccountIfNew(RegistrationRequest request);
    Account saveUserInfo(UserInfo info, String email);
    Account createAccount(AccountDTO accountDTO);

    void deleteAccount(String accountId);

    Account updateAccount(Account account);
    Account updateAccount(AccountDTO accountDTO);
    Account updateAccountPassword(RegistrationRequest request);

    void updateAccountStatusActive (String email);
    Long countAllAccountByRole (List<Role> role);
    boolean checkCurrentOrderExist(String accountId);
}
