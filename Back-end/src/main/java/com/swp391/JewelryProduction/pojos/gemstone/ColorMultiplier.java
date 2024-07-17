package com.swp391.JewelryProduction.pojos.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
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
@Table(name = "Color_Multiplier")
public class ColorMultiplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private GemstoneColor color;

    private double multiplier;
}
