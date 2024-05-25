package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.pojos.Design;
import com.swp391.JewleryProduction.pojos.FinalQuotation;
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
    private FinalQuotation quotation;
    private Design design;
}
