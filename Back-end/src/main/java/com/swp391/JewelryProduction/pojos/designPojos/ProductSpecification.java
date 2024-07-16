package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp391.JewelryProduction.pojos.Price.GemstonePrice;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "metal_id")
    private MetalPrice metal;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String texture;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String chainType;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gemstone_id")
    private GemstonePrice gemstone;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "specification", fetch = FetchType.LAZY)
    private List<Product> products;
}
