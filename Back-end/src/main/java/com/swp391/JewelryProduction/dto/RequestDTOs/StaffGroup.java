package com.swp391.JewelryProduction.dto.RequestDTOs;

import com.swp391.JewelryProduction.pojos.Staff;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffGroup {
    @NotNull
    @NotEmpty
    @Pattern(regexp = "^ACC\\d{5}$")
    private String saleStaffID;
    @NotNull
    @NotEmpty
    @Pattern(regexp = "^ACC\\d{5}$")
    private String designStaffID;
    @NotNull
    @NotEmpty
    @Pattern(regexp = "^ACC\\d{5}$")
    private String productionStaffID;
}
