package com.swp391.JewelryProduction.pojos.Price;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.JewelryProduction.enums.GemstoneShape;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

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
}
