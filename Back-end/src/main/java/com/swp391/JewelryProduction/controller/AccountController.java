package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/{accountId}")
    public ResponseEntity<Response> getInfo (
            @PathVariable("accountId")
            @NotBlank @NotEmpty
            @Pattern(regexp = "^(ACC)\\d{5}$", message = "The accountID is not valid")
            @Valid
            String accountId
    ) {
        return Response.builder()
                .response("account", accountService.findAccountById(accountId))
                .buildEntity();
    }

    @PutMapping("/{accountId}")
    public ResponseEntity<Response> updateInfo (
            @PathVariable("accountId")
            String accountId,
            @RequestBody UserInfo userInfo
    ) {
        Account updatedAcc = accountService.findAccountById(accountId);
        updatedAcc = accountService.saveUserInfo(userInfo, updatedAcc.getEmail());
        System.out.println("Test 2");
        return Response.builder()
                .response("account", updatedAcc)
                .buildEntity();
    }

    @GetMapping("/{accountId}/check-current-order")
    public ResponseEntity<Boolean> checkExistCurrentOrder (
            @PathVariable("accountId") String accountId
    ) {
        return ResponseEntity.ok(accountService.checkCurrentOrderExist(accountId));
    }

    @GetMapping("/{offset}")
    public ResponseEntity<Response> getAccountByRole(
            @PathVariable("offset") int offset,
            @RequestParam(name = "role", defaultValue = "ALL") Role role,
            @RequestParam(name = "size", defaultValue = "5") int elementPerPage,
            @RequestParam(name = "sort-by", required = false) String sortBy
    ) {
        Page<Account> accountPage;
        if (role.equals(Role.ALL))
            accountPage = accountService.findAll(offset, elementPerPage);
        else
            accountPage = accountService.findAllByRole(role, offset, elementPerPage);

        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("accounts", accountPage.getContent())
                .response("totalPages", accountPage.getTotalPages())
                .response("totalElements", accountPage.getTotalElements())
                .buildEntity();
    }

    @PostMapping("/")
    public ResponseEntity<Response> createAccount(@RequestBody AccountDTO accountDTO) {
        accountDTO.setDateCreated(LocalDateTime.now());
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account", accountService.createAccount(accountDTO))
                .buildEntity();
    }

    @PutMapping("/")
    public ResponseEntity<Response> updateAccount(@RequestBody AccountDTO accountDTO) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account", accountService.updateAccount(accountDTO))
                .buildEntity();
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Response> deleteAccount(@PathVariable String accountId) {
        accountService.deleteAccount(accountId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }
}
