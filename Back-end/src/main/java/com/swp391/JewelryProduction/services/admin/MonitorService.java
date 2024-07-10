package com.swp391.JewelryProduction.services.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.net.Socket;

@Service
@RequiredArgsConstructor
@Component
public class MonitorService implements HealthIndicator {
    private final JdbcTemplate jdbcTemplate;
    @Override
    public Health health() {
        if(checkDatabaseConnection()) return Health.up().build();
        else return Health.down().build();
    }

    public boolean checkDatabaseConnection() {
        try {
            jdbcTemplate.execute("select 1");
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
