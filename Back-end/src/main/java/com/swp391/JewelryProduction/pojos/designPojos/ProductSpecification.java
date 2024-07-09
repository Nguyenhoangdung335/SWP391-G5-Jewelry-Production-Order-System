package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "specification", fetch = FetchType.EAGER)
    private List<Product> products;
}
