package com.swp391.JewelryProduction.pojos.gemstone;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Gemstone_Type")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class GemstoneType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double basePricePerCarat;
}
