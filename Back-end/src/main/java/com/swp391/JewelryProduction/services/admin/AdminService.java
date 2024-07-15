package com.swp391.JewelryProduction.services.admin;

import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.util.HashMap;

public interface AdminService {
    HashMap<String, Object> dashboardDataProvider();

    Flux<ServerSentEvent<HashMap<String, Object>>> subscribeDashboard();
}
