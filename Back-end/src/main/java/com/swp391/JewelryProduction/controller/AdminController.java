package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AccountService accountService;

    @GetMapping("/account-list")
    public ResponseEntity<Response> getAccounts() {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account-list", accountService.findAllAccounts())
                .buildEntity();
    }

    @PostMapping("/account/remove/{accountId}")
    public ResponseEntity<Response> deleteAccount(@PathVariable("accountId") String accountId) {
        accountService.deleteAccount(accountId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }

    @PostMapping("/account/remove")
    public ResponseEntity<Response> updateAccount(@RequestBody AccountDTO newAccount) {
        accountService.updateAccount(newAccount);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }
}
