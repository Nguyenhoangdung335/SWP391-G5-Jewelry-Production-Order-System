package com.swp391.JewelryProduction.services.product;

import com.swp391.JewelryProduction.dto.ProductDTO;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Page<Product> findAll(int page, int size);
    Page<Product> findAll(int page, int size, boolean isFinished);
    Product findById (String productId);
    Product saveProduct(Product product);
    void deleteProduct(String id);

    Page<ProductSpecification> findAllSpecification(int page, int size);
    ProductSpecification findProductSpecificationById(int id);
    ProductSpecification saveSpecification(ProductSpecification specs);
    ProductSpecification updateSpecification(Integer specificationId, ProductSpecification specs);
    void deleteSpecificationById(int id);

    Double calculateRoughProductPrice(int productSpecificationId);

    List<Product> findAllByOrderByIdDesc (Limit limit);

    Product updateProduct(Product product);
}
