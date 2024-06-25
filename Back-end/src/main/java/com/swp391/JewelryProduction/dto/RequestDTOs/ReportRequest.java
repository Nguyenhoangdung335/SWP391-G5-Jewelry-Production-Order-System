package com.swp391.JewelryProduction.dto.RequestDTOs;

import com.swp391.JewelryProduction.enums.ReportType;
import com.swp391.JewelryProduction.util.CustomValidator.EnumNameValidator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportRequest {
    @NotEmpty(message = "The request must contain a title")
    @NotBlank(message = "The request title must not be blank")
    private String title;
    @NotEmpty(message = "The request must contain a description content")
    @NotBlank(message = "The request description must not be blank")
    private String description;
    @EnumNameValidator(regexp = "REQUEST|QUOTATION|DESIGN|NONE", message = "Report Type of assigned one")
    @NotNull
    private ReportType type;
    private String senderId;
    //Contain id for Specification id, Quotation id, Design id
    @NotEmpty(message = "The request must contain the contentID, must assign the id for either Specification id, quotation id, or design id")
    @NotBlank(message = "The request contentID must not be blank, must assign the id for either Specification id, quotation id, or design id")
    private String reportContentID;
}
