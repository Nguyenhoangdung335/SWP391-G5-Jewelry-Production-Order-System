package com.swp391.JewelryProduction.pojos.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "Shape_Multiplier")
public class ShapeMultiplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private GemstoneShape shape;

    private double multiplier;
}
