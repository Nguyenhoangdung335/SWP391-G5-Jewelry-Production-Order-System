package com.swp391.JewelryProduction.pojos.designPojos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product_specification")
@EqualsAndHashCode(exclude = {"id"})
public class ProductSpecification {
    @Id
    @GeneratedValue
    private Integer id;

    private String type;

    private String style;

    private String occasion;

    private String length;

    private String metal;

    private String texture;

    private String chainType;

    private String gemstone;

    private String shape;

    private String gemstoneWeight;
}
