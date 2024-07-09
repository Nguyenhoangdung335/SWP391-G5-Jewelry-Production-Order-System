package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
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
}
