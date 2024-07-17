package com.swp391.JewelryProduction.pojos.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
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
@Table(name = "Clarity_Multiplier")
public class ClarityMultiplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private GemstoneClarity clarity;

    private double multiplier;
}
