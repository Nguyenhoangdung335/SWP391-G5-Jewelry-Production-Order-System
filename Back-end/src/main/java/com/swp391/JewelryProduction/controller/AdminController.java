package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.AccountDTO;
import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.services.admin.AdminService;
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
    private final AccountService accountService;
    private final StaffService staffService;
    private final OrderService orderService;
    private final AdminService adminService;

    @GetMapping("/account-list")
    public ResponseEntity<Response> getAccounts() {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account-list", accountService.findAllAccounts())
                .buildEntity();
    }

    @GetMapping("/get/staff")
    public ResponseEntity<Response> getAvailableStaffLists (@RequestParam("role") Role role) {
        if (!role.equals(Role.ADMIN) && !role.equals(Role.MANAGER)) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("Not authorized fetch staff list")
                    .buildEntity();
        }
        return Response.builder()
                .message("Request sent successfully")
                .response("saleStaffs", staffService.findAllByRole(Role.SALE_STAFF))
                .response("designStaffs", staffService.findAllByRole(Role.DESIGN_STAFF))
                .response("productionStaffs", staffService.findAllByRole(Role.PRODUCTION_STAFF))
                .buildEntity();
    }

//    @PostMapping("/account/remove/{accountId}")
//    public ResponseEntity<Response> deleteAccount(@PathVariable("accountId") String accountId) {
//        return Response.builder()
//                .status(HttpStatus.OK)
//                .message("Request sent successfully")
//                .buildEntity();
//    }

//    @PostMapping("/account/remove")
//    public ResponseEntity<Response> updateAccount(@RequestBody AccountDTO newAccount) {
//        accountService.updateAccount(newAccount);
//        return Response.builder()
//                .status(HttpStatus.OK)
//                .message("Request sent successfully")
//                .buildEntity();
//    }

    //<editor-fold desc="ADMIN" defaultstate="collapsed>

    //<editor-fold desc="CLIENTS/EMPLOYEES" defaultstate="collapsed>
    @GetMapping("/get/account/{offset}")
    public ResponseEntity<Response> getAccountByRole(
            @PathVariable("offset") int offset,
            @RequestParam(value = "role", defaultValue = "ALL") Role role,
            @RequestParam(value = "size", defaultValue = "5") int elementPerPage
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
    @PostMapping("/create/account")
    public ResponseEntity<Response> createAccount(@RequestBody AccountDTO accountDTO) {
        accountDTO.setDateCreated(LocalDateTime.now());
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account", accountService.createAccount(accountDTO))
                .buildEntity();
    }
    @PutMapping("/update/account")
    public ResponseEntity<Response> updateAccount(@RequestBody AccountDTO accountDTO) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("account", accountService.updateAccount(accountDTO))
                .buildEntity();
    }
    @DeleteMapping("/delete/account")
    public ResponseEntity<Response> deleteAccount(@RequestParam String accountId) {
        accountService.deleteAccount(accountId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }
    //</editor-fold>

    //<editor-fold desc="ORDER" defaultstate="collapsed>
    @GetMapping("/get/order/{offset}")
    public ResponseEntity<Response> getOrder(
                @PathVariable("offset") int offset,
                @RequestParam(value = "accountId", required = true) String accountId,
                @RequestParam(value = "role", required = true) Role role,
                @RequestParam(value = "status", defaultValue = "ALL") OrderStatus status,
                @RequestParam(value = "size", defaultValue = "5") int elementsPerPage
    ) {
        Page<Order> orderPage = orderService.findOrdersByPageAndStatusBasedOnRole(accountId, role, status, offset, elementsPerPage);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("orders", orderPage.getContent())
                .response("totalPages", orderPage.getTotalPages())
                .response("totalElements", orderPage.getTotalElements())
                .buildEntity();
    }

    @PostMapping("/update/order")
    public ResponseEntity<Response> updateOrder(@RequestBody OrderDTO orderDTO) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("order", orderService.updateOrder(orderDTO))
                .buildEntity();
    }

    @PostMapping("/delete/order")
    public ResponseEntity<Response> deleteOrder(@RequestParam String orderId) {
        orderService.deleteOrder(orderId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }
    //</editor-fold>

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
