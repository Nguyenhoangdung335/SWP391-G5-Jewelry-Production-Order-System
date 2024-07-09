package com.swp391.JewelryProduction.services.admin;

import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
    private final AccountService accountService;
    private final OrderService orderService;

    @Override
    public HashMap<String, Integer> dashboardDataProvider() {
        HashMap<String, Integer> data = new HashMap<>();
        data.put("numCustomers", accountService.findAccountsByRole(Role.CUSTOMER).size());
        data.put("numStaffs", accountService.findAccountsByRole(Role.SALE_STAFF).size()
                + accountService.findAccountsByRole(Role.DESIGN_STAFF).size()
                + accountService.findAccountsByRole(Role.PRODUCTION_STAFF).size()
                + accountService.findAccountsByRole(Role.MANAGER).size()
                + accountService.findAccountsByRole(Role.ADMIN).size());
        data.put("numOrders", orderService.findAllOrders().size());
        for(int i = 1; i <= 12; i ++ ) {
            data.put("month_" + i, (int) orderService.calculateTotalRevenueMonthly(i));
        }
        return data;
    }
}
