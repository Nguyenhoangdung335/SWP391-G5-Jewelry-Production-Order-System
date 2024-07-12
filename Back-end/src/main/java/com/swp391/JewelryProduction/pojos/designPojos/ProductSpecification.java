package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private String metal;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String texture;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String chainType;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String gemstone;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String shape;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String gemstoneWeight;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "specification", fetch = FetchType.LAZY)
    private List<Product> products;
}
