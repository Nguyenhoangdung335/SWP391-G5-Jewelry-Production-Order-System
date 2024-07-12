package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
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
    @ToString.Include
    @EqualsAndHashCode.Include
    private Integer id;
    @ToString.Include
    @EqualsAndHashCode.Include
    private Integer itemID;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String name;
    @ToString.Include
    @EqualsAndHashCode.Include
    private double quantity;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "unit_price", columnDefinition = "decimal(15,2)")
    private double unitPrice;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Formula("quantity * unit_price")
    private double totalPrice;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "quotation_id")
    @JsonBackReference("Quotation-Items")
    private Quotation quotation;

    public Integer getItemID () {
        return itemID = quotation.getQuotationItems().indexOf(this);
    }
}
