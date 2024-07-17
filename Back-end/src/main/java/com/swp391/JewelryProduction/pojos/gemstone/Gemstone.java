package com.swp391.JewelryProduction.pojos.gemstone;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "Gemstone")
public class Gemstone {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "gemstone_id")
    private GemstoneType type;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneShape shape;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneCut cut;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneClarity clarity;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private GemstoneColor color;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "carat_weight")
    private double caratWeight;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    @OneToOne(mappedBy = "gemstone")
    private ProductSpecification specification;
}
