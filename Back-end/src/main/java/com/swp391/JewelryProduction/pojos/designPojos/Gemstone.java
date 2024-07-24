package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

import static com.swp391.JewelryProduction.util.CustomFormatter.roundToDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "Gemstone")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Gemstone {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @ToString.Include
    @EqualsAndHashCode.Include
    private String name;

    @NotNull
    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneShape shape;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneCut cut;

    @NotNull
    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneClarity clarity;

    @NotNull
    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneColor color;

    @DecimalMin("0.01")
    @DecimalMax("11.0")
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "carat_weight_from")
    private double caratWeightFrom;

    @DecimalMin("0.01")
    @DecimalMax("11.0")
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "carat_weight_to")
    private double caratWeightTo;

    @DecimalMin("0.01")
    @DecimalMax("100.0")
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "price_per_carat")
    private double pricePerCaratInHundred;

    @Builder.Default
    @ToString.Include
    @EqualsAndHashCode.Include
    @JsonIgnore
    private boolean active = true;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "gemstone")
    private List<ProductSpecification> specifications;

    public Gemstone copyGemstone (Gemstone gemstone) {
        this.name = gemstone.getName();
        this.shape = gemstone.getShape();
        this.cut = gemstone.getCut();
        this.clarity = gemstone.getClarity();
        this.color = gemstone.getColor();
        this.caratWeightFrom = gemstone.getCaratWeightFrom();
        this.caratWeightTo = gemstone.getCaratWeightTo();
        this.pricePerCaratInHundred = gemstone.getPricePerCaratInHundred();
        this.active = gemstone.isActive();
        return this;
    }
}
