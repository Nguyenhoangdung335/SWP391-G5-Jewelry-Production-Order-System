package com.swp391.JewelryProduction.dto;

import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderDTO {
    private String id;
    private String name;
    private double budget;
    private LocalDateTime createdDate;
    private String quotationId;
    private String designId;
    private OrderStatus status;
    private String productId;
}
