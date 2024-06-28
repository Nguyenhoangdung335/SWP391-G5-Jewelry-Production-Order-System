package com.swp391.JewelryProduction.services.product;

import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;

import java.util.List;

public interface ProductService {
    List<Product> findAll();
    Product findById (String productId);
    Product saveProduct(Product product);
    void deleteProduct(String id);

    List<ProductSpecification> findAllSpecification();
    ProductSpecification findProductSpecificationById(int id);
    ProductSpecification saveSpecification(ProductSpecification specs);
}
