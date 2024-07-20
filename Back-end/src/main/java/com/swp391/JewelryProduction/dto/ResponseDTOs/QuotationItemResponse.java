package com.swp391.JewelryProduction.dto.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationItemResponse {
    private Integer itemID;
    private String name;
    private double quantity;
    private double unitPrice;
    private double totalPrice;
}
