package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.services.email.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TestController{

    private final EmailService emailService;

    @GetMapping("/hello")
    ResponseEntity<String> hello() {
        return new ResponseEntity<String>("Hello World!", HttpStatus.OK);
    }

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }

    @GetMapping("/sample")
    public String showForm() {
        return "sample";
    }

    @PostMapping("/receipt")
    public String testReceipt() throws MessagingException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John Doe");
        variables.put("businessName", "Custom Jewelery");
        variables.put("payerName", "John Doe");
        variables.put("receipt_id", "12345");
        variables.put("date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        variables.put("total", "$100.00");
        variables.put("currentYear", LocalDate.now().getYear());

        Map<String, String> items = new HashMap<>();
        items.put("Product 1", "$50.00");
        items.put("Product 2", "$50.00");

        variables.put("items", items);

        emailService.sendReceiptEmail("nguyenhoangdung335@gmail.com", "Test receipt", variables);

        return "Email is being sent!";
    }
}
