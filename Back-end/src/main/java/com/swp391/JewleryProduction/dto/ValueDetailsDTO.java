package com.swp391.JewleryProduction.dto;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValueDetailsDTO {
    private Integer styleID;
    private String parameterName;
    private String parameterValue;
}
