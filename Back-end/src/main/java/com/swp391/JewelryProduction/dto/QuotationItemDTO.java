package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.pojos.FinalQuotation;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuotationItemDTO {
    private Integer id;
    private String name;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    private FinalQuotation quotation;
}
