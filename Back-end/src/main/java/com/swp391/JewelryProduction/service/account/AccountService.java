package com.swp391.JewleryProduction.services.account;

import com.swp391.JewleryProduction.dto.AccountDTO;
import com.swp391.JewleryProduction.pojos.Account;
import com.swp391.JewleryProduction.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService implements IAccountService{

    private AccountRepository accountRepository;

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<AccountDTO> findAllAccounts() {
        return accountRepository.findAll().stream().map(account -> mapToAccountDTO(account)).collect(Collectors.toList());
    }

    private AccountDTO mapToAccountDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .email(account.getEmail())
                .password(account.getPassword())
                .dateCreated(account.getDateCreated())
                .role(account.getRole())
                .status(account.getStatus())
                .build();
    }
}
