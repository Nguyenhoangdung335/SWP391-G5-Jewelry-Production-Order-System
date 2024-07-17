package com.swp391.JewelryProduction.pojos.Price;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp391.JewelryProduction.enums.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Diamond_Price")
public class GemstonePrice {
     @Id
     @GeneratedValue
     private Integer id;

     @Column(name = "gemstone", length = 30, nullable = true)
     private String gemstone;

     @Enumerated(EnumType.STRING)
     private GemstoneShape shape;

     @Column(name = "carat_weight", nullable = true)
     private Double caratWeight;

     private Double price;

     @DateTimeFormat(pattern = "HH:mm dd-MM-yyyy")
     @JsonFormat(pattern = "HH:mm dd-MM-yyyy")
     private LocalDateTime updatedTime;

//     @ToString.Exclude
//     @EqualsAndHashCode.Exclude
//     @JsonIgnore
//     @OneToMany(mappedBy = "gemstone", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//     private List<ProductSpecification> specifications;
}
