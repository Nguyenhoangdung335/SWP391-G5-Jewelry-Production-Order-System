package com.swp391.JewelryProduction.services.product;

import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.repositories.MetalRepository;
import com.swp391.JewelryProduction.repositories.ProductRepository;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final OrderService orderService;
    private final GemstoneService gemstoneService;
    private final MetalRepository metalRepository;
    private final CrawlDataService crawlDataService;

    @Value("${price.default.sale_staff}")
    private double DEFAULT_SALE_STAFF_PRICE;
    @Value("${price.default.design_staff}")
    private double DEFAULT_DESIGN_STAFF_PRICE;
    @Value("${price.default.production_staff}")
    private double DEFAULT_PRODUCTION_STAFF_PRICE;


    //<editor-fold desc="PRODUCT SERVICES" defaultstate="collapsed">
    @Override
    public Page<Product> findAll(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size));
    }

    @Override
    public Page<Product> findAll(int page, int size, boolean isFinished) {
        if (isFinished)
            return productRepository.findAllByOrdersStatusIs(PageRequest.of(page, size), OrderStatus.ORDER_COMPLETED);
        else
            return productRepository.findAll(PageRequest.of(page, size));
    }

    @Override
    public Product findById(String productId) {
        return productRepository.findById(productId).orElseThrow(
                        () -> new ObjectNotFoundException("Product id "+productId+" cannot be found")
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
        Product product = productRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Product with id "+id+" does not exist")
        );
        product.getOrders().forEach(order -> {
                order.setProduct(null);
                orderService.updateOrder(order);
        });
        product.setOrders(null);
        productRepository.save(product);
        productRepository.deleteById(id);
    }
    //</editor-fold>

    //<editor-fold desc="PRODUCT SPECIFICATION SERVICES" defaultstate="collapsed">
    @Override
    public Page<ProductSpecification> findAllSpecification (int page, int size) {
        return productSpecificationRepository.findAll(PageRequest.of(page, size));
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
    public ProductSpecification saveSpecification(ProductSpecification specs) {
        for(ProductSpecification proSpecs : productSpecificationRepository.findAll()) {
            if(proSpecs.equals(specs)) return proSpecs;
        }
        Gemstone gemstone = specs.getGemstone();
        Metal metal = specs.getMetal();

        if (gemstone != null) {
            gemstone = gemstoneService.findById(metal.getId());
            specs.setGemstone(gemstone);
        }

        if (metal != null) {
            metal = metalRepository.findById(metal.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Metal ID"));
            specs.setMetal(metal);
        }
        return productSpecificationRepository.save(specs);
    }

    @Override
    public ProductSpecification updateSpecification(Integer specificationId, ProductSpecification specs) {
        ProductSpecification oldSpecs = productSpecificationRepository.findById(specificationId).orElseThrow(
                () -> new ObjectNotFoundException("Failed to update, Specification with id "+specificationId+" does not exist")
        );
        return productSpecificationRepository.save(mapNewSpecification(oldSpecs, specs));
    }

    @Transactional
    @Override
    public void deleteSpecificationById(int id) {
        ProductSpecification specification = productSpecificationRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Cannot found specification with id "+id)
        );
        specification.setGemstone(null);
        specification.setMetal(null);
        specification = productSpecificationRepository.save(specification);
        List<Product> products = productRepository.findAllBySpecificationId(id);
        products.forEach(prod -> {
            prod.setSpecification(ProductSpecification.builder().build());
        });
        productRepository.saveAll(products);
        productSpecificationRepository.delete(specification);
    }

    @Override
    public Double calculateRoughProductPrice(int productSpecificationId) {
//        return calculatePrice(
//                productSpecificationRepository.findById(productSpecificationId).orElseThrow(
//                        () -> new ObjectNotFoundException("Specification with id "+ productSpecificationId+" not found")
//        ));
        return 0.0;
    }

    @Override
    public List<Product> findAllByOrderByIdDesc(Limit limit) {
        return productRepository.findAllByOrderByIdDesc(limit);
    }

//    private Double calculatePrice (ProductSpecification specs) {
//        double price = gemstoneService.calculatePrice(specs.getGemstone());
//        price += DEFAULT_SALE_STAFF_PRICE + DEFAULT_DESIGN_STAFF_PRICE + DEFAULT_PRODUCTION_STAFF_PRICE;
//        price += specs.getMetal().getPrice();
//        return price;
//    }
    //</editor-fold>

    private ProductSpecification mapNewSpecification (ProductSpecification oldSpecs, ProductSpecification newSpecs) {
        oldSpecs.setType(newSpecs.getType());
        oldSpecs.setOccasion(newSpecs.getOccasion());
        oldSpecs.setLength(newSpecs.getLength());
        oldSpecs.setMetal(newSpecs.getMetal());
        oldSpecs.setTexture(newSpecs.getTexture());
        oldSpecs.setChainType(newSpecs.getChainType());
        oldSpecs.setGemstone(newSpecs.getGemstone());
        return oldSpecs;
    }
}
