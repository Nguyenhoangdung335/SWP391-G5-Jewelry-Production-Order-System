package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import static com.swp391.JewelryProduction.util.CustomFormatter.roundToDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product_specification")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductSpecification {
    @Id
    @GeneratedValue
    @ToString.Include
    @EqualsAndHashCode.Include
    private Integer id;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String type;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String style;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String occasion;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String length;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String texture;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String chainType;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "gemstone_id")
    private Gemstone gemstone;

    @ToString.Include
    @EqualsAndHashCode.Include
    private Double gemstoneWeight;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "metal_id")
    private Metal metal;

    @ToString.Include
    @EqualsAndHashCode.Include
    private Double metalWeight;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "specification", fetch = FetchType.LAZY)
    private Product product;

    @JsonIgnore
    public double getTotalMetalCost() {
        if (metal != null && metalWeight != null) {
            return roundToDecimal(metal.getCompanyPrice() * metalWeight, 2);
        }
        return 0.0;
    }

    @JsonIgnore
    public double getTotalGemstoneCost() {
        if (gemstone != null && gemstoneWeight != null) {
            return roundToDecimal(gemstone.getPricePerCaratInHundred() * 100 * gemstoneWeight, 2);
        }
        return 0.0;
    }
}
