package com.swp391.JewleryProduction.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DesignDTO {
    private String id;
    private LocalDateTime lastUpdated;
    private String designLink;
}
