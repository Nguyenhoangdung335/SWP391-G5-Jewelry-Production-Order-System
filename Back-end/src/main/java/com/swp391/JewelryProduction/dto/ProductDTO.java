package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.pojos.ProductSpecification;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDTO {
    private String id;
    private String name;
    private String description;
    private ProductSpecification specification;
}
