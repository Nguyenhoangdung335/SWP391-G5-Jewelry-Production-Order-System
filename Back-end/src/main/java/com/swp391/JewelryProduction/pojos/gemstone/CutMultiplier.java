package com.swp391.JewelryProduction.pojos.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
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
@Table(name = "Cut_Multiplier")
public class CutMultiplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private GemstoneCut cutQuality;

    private double multiplier;
}
