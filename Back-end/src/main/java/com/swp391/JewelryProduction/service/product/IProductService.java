package com.swp391.JewleryProduction.services.product;

import com.swp391.JewleryProduction.dto.ProductDTO;

import java.util.List;

public interface IProductService {
    List<ProductDTO> findAllProducts();
}
