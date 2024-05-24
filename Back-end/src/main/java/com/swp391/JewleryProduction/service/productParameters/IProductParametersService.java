package com.swp391.JewleryProduction.services.productParameters;

import com.swp391.JewleryProduction.dto.ProductParametersDTO;

import java.util.List;

public interface IProductParametersService {
    List<ProductParametersDTO> findAllProductParameters();
}
