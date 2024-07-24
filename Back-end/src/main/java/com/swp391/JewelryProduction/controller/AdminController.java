package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.designPojos.GemstoneType;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.services.admin.AdminService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.HashMap;

@CrossOrigin("*")
@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    //<editor-fold desc="DASHBOARD ENDPOINT" defaultstate="collapsed">
    @GetMapping("/dashboard-test")
    public ResponseEntity<Response> getDashboard() {
        return Response.builder()
                .responseList(adminService.dashboardDataProvider())
                .buildEntity();
    }

    @GetMapping("/dashboard")
    public Flux<ServerSentEvent<HashMap<String, Object>>> subscribeDashboard () {
        return adminService.subscribeDashboard();
    }
    //</editor-fold>
}
