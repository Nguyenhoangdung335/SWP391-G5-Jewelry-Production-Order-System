package com.swp391.JewelryProduction.dto.RequestDTOs;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GemstoneRequest {
    @NotBlank
    String name;
    GemstoneShape shape;
    GemstoneClarity clarity;
    GemstoneColor color;
    @DecimalMin("0.01") @DecimalMax("11.0")
    Double weight;
    GemstoneCut cut;
}
