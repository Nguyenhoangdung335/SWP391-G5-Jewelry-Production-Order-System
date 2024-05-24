package com.swp391.JewleryProduction.services.productSpecification;

import com.swp391.JewleryProduction.dto.ProductSpecificationDTO;

import java.util.List;

public interface IProductSpecificationService {
    List<ProductSpecificationDTO> findAllProductSpecifications();
}
