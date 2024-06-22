package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class QuotationItem {
    @Id
    @GeneratedValue
    @JsonIgnore
    private Integer id;
    private Integer itemID;
    private String name;
    private int quantity;
    @Column(name = "unit_price", columnDefinition = "decimal(15,2)")
    private double unitPrice;
    @Formula("quantity * unit_price")
    private double totalPrice;

    @ManyToOne
    @JoinColumn(name = "quotation_id")
    @JsonBackReference
    private Quotation quotation;

    public Integer getItemID () {
        return itemID = quotation.getQuotationItems().indexOf(this);
    }
}
