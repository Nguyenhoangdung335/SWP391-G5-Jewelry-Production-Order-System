package com.swp391.JewelryProduction.services.account;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface AccountService {
    List<Account> findAllAccounts();
    Account updateAccountPassword(AccountDTO accountDTO);
    Account saveAccountIfNew(AccountDTO accountDTO);
    Account saveUserInfo(UserInfo info, String email);
    Account findAccountById(String accountId);
    Account findAccountByEmailAndPassword(String email, String password);
    Account findAccountByEmail(String email);
    Account updateAccountStatusActive (String email);
    UserInfo findInfoById(String id);
    UserInfo findInfoByEmail(String email);
    Account findAccountByRole(Role role);
    void saveAccountPassword(AccountDTO accountDTO, String newPassword);
    boolean checkCurrentOrderExist(String accountId);
    Page<Account> findAllByRole(Role role, int offset);
    Account createAccount(AccountDTO accountDTO);
    void deleteAccount(String accountId);
    Account updateAccount(AccountDTO accountDTO);
}
