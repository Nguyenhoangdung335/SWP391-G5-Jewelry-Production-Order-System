package com.swp391.JewelryProduction.pojos.designPojos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product_specification")
public class ProductSpecification {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @MapKeyJoinColumn(name = "product_parameter_id")
    @OneToMany(mappedBy = "productSpecification", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Map<ProductParameters, SpecificationValues> parameterValues;
}