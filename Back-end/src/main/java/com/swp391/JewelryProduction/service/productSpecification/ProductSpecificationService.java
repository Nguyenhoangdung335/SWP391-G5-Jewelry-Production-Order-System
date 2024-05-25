package com.swp391.JewleryProduction.services.productSpecification;

import com.swp391.JewleryProduction.dto.ProductParametersDTO;
import com.swp391.JewleryProduction.dto.ProductSpecificationDTO;
import com.swp391.JewleryProduction.pojos.ProductSpecification;
import com.swp391.JewleryProduction.repositories.ProductSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductSpecificationService implements IProductSpecificationService{
    private final ProductSpecificationRepository productSpecificationRepository;

    @Autowired
    public ProductSpecificationService(ProductSpecificationRepository productSpecificationRepository) {
        this.productSpecificationRepository = productSpecificationRepository;
    }

    @Override
    public List<ProductSpecificationDTO> findAllProductSpecifications() {
        return productSpecificationRepository.findAll().stream().map(productSpecification -> mapToProductSpecificationDTO(productSpecification)).collect(Collectors.toList());
    }

    private ProductSpecificationDTO mapToProductSpecificationDTO(ProductSpecification productSpecification) {
        return ProductSpecificationDTO.builder()
                .id(productSpecification.getId())
                .parameterValues(productSpecification.getParameterValues())
                .build();
    }

}
