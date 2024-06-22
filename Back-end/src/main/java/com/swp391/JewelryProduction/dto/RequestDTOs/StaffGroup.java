package com.swp391.JewelryProduction.dto.RequestDTOs;

import com.swp391.JewelryProduction.pojos.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffGroup {
    private String saleStaffID;
    private String designStaffID;
    private String productionStaffID;
}
