package com.swp391.JewelryProduction.services.product;

import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.repositories.ProductRepository;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final OrderService orderService;

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(String productId) {
        return productRepository.
                findById(productId).
                orElseThrow(
                        () -> new ObjectNotFoundException("Product id "+productId+" cannot be found")
                );
    }

    @Override
    public List<ProductSpecification> findAllSpecification () {
        return productSpecificationRepository.findAll();
    }

    @Override
    public ProductSpecification findProductSpecificationById(int id) {
        return productSpecificationRepository.
                findById(id)
                .orElseThrow(
                        () -> new ObjectNotFoundException("Product specification with id " + id + " does not exist")
                );
    }

    @Transactional
    @Override
    public Product saveProduct(Product product) {
        productRepository.save(product);
        return product;
    }

    @Transactional
    @Override
    public void deleteProduct(String id) {
        orderService.findOrderByProductId(id).setProduct(null);
        productRepository.deleteById(id);
    }

    @Transactional
    @Override
    public ProductSpecification saveSpecification(ProductSpecification specs) {
        for(ProductSpecification proSpecs : productSpecificationRepository.findAll()) {
            if(proSpecs.equals(specs)) return proSpecs;
        }
        return productSpecificationRepository.save(specs);
    }

    @Transactional
    @Override
    public void deleteSpecificationById(int id) {
        productSpecificationRepository.deleteById(id);
    }


}
