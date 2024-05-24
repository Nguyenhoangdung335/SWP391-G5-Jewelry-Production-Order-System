package com.swp391.JewleryProduction.services.productParameters;

import com.swp391.JewleryProduction.dto.ProductParametersDTO;
import com.swp391.JewleryProduction.pojos.ProductParameters;
import com.swp391.JewleryProduction.repositories.ProductParametersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class ProductParametersService implements IProductParametersService{
    private ProductParametersRepository productParametersRepository;

    @Autowired
    public ProductParametersService (ProductParametersRepository productParametersRepository) {
        this.productParametersRepository = productParametersRepository;
    }

    @Override
    public List<ProductParametersDTO> findAllProductParameters() {
        return productParametersRepository.findAll().stream().map(productParameter -> mapToProductParametersDTO(productParameter)).collect(Collectors.toList());
    }

    private ProductParametersDTO mapToProductParametersDTO(ProductParameters productParameter) {
        return ProductParametersDTO.builder()
                .parameters(productParameter.getParameters())
                .id(productParameter.getId())
                .name(productParameter.getName())
                .build();
    }
}
