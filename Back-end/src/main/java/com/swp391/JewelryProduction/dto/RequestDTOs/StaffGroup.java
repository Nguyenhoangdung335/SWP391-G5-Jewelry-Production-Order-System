package com.swp391.JewelryProduction.dto.RequestDTOs;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffGroup {
    @NotEmpty
    @Pattern(regexp = "^ACC\\d{5}$")
    private String saleStaffID;
    @Pattern(regexp = "^ACC\\d{5}$")
    private String designStaffID;
    @NotEmpty
    @Pattern(regexp = "^ACC\\d{5}$")
    private String productionStaffID;
}
