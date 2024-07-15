package com.swp391.JewelryProduction.services.admin;

import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.text.DateFormatSymbols;
import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
    private final AccountService accountService;
    private final OrderService orderService;

    @Override
    public HashMap<String, Object> dashboardDataProvider() {
        HashMap<String, Object> data = new HashMap<>();
        data.put("numCustomers", accountService.countAllAccountByRole(List.of(Role.CUSTOMER)));
        data.put("numStaffs", accountService.countAllAccountByRole(List.of(Role.SALE_STAFF, Role.DESIGN_STAFF, Role.PRODUCTION_STAFF, Role.MANAGER, Role.ADMIN)));
        data.put("numOrders", orderService.countAllOrders());
        String currentYear = String.valueOf(LocalDate.now().getYear());
        List<String> months = Arrays.stream(new DateFormatSymbols().getMonths()).filter(month -> !month.isEmpty()).map(month -> month + " " + currentYear).toList();
        List<Object> monthlyRevenue = new ArrayList<>();
        double revenue = 0;
        for(int i = 1; i <= months.size(); i ++ ) {
            double temp = orderService.calculateTotalRevenueMonthly(i);
            revenue += temp;
            monthlyRevenue.add(temp);
        }
        data.put("labelsList", months);
        data.put("dataList", monthlyRevenue);
        data.put("revenue", String.format("%.2f", revenue));
        return data;
    }

    @Override
    public Flux<ServerSentEvent<HashMap<String, Object>>> subscribeDashboard() {
        return Flux.merge(getData(), getHeartbeat());
    }

    private Flux<ServerSentEvent<HashMap<String, Object>>> getData () {
        return Flux.interval(Duration.ofSeconds(10))
                .publishOn(Schedulers.boundedElastic())
                .map(priceData -> ServerSentEvent.<HashMap<String, Object>>builder()
                        .event("live")
                        .data(dashboardDataProvider())
                        .build())
                .startWith(ServerSentEvent.<HashMap<String, Object>>builder()
                        .event("live")
                        .data(dashboardDataProvider())
                        .build());
    }

    private Flux<ServerSentEvent<HashMap<String, Object>>> getHeartbeat () {
        return Flux.interval(Duration.ofSeconds(3))
                .map(seq -> ServerSentEvent.<HashMap<String, Object>>builder()
                        .id("heartbeat")  // Use priceData size as ID
                        .event("heartbeat")
                        .build());
    }
}
