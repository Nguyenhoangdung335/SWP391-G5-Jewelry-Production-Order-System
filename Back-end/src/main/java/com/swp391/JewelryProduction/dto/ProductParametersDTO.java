package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.pojos.ParameterValue;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductParametersDTO {
    private Integer id;
    private String name;
    private List<ParameterValue> parameters;
}
