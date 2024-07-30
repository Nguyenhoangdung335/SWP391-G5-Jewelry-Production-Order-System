package com.swp391.JewelryProduction.dto.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetalResponse {
    private Long id;
    private String name;
    private String unit;
}
