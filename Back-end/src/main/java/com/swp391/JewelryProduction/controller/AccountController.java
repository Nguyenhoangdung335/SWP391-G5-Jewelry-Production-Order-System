package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/{accountId}")
    public ResponseEntity<Response> getInfo (
            @PathVariable("accountId")
            @NotBlank @NotEmpty
            @Pattern(regexp = "^(ACC)\\d{5}$|\\d+", message = "The accountID is not valid")
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
            @NotBlank @NotEmpty
            @Pattern(regexp = "^(ACC)\\d{5}$|\\d+", message = "The accountID is not valid")
            @Valid
            String accountId,
            AccountDTO accountDTO
    ) {
        accountDTO.setId(accountId);
        Account updatedAcc = accountService.updateAccount(accountDTO);
        return Response.builder()
                .response("account", updatedAcc)
                .buildEntity();
    }
}
