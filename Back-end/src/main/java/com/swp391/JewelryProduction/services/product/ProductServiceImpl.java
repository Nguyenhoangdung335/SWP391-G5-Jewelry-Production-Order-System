package com.swp391.JewelryProduction.services.product;

import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.repositories.MetalRepository;
import com.swp391.JewelryProduction.repositories.ProductRepository;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.services.metal.MetalService;
import com.swp391.JewelryProduction.services.metal.MetalServiceImpl;
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
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final OrderService orderService;
    private final GemstoneService gemstoneService;
    private final MetalRepository metalRepository;
    private final MetalService metalService;


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
        ProductSpecification specs = product.getSpecification();
        if (specs.getGemstone() != null)
            specs.setGemstone(gemstoneService.findById(specs.getGemstone().getId()));
        specs.setMetal(metalService.findById(specs.getMetal().getId()));
        return productRepository.save(product);
    }

    @Transactional
    @Override
    public Product updateProduct(Product product) {
        ProductSpecification specs = product.getSpecification();
        if (specs.getGemstone() != null)
            specs.setGemstone(gemstoneService.findById(specs.getGemstone().getId()));
        specs.setMetal(metalService.findById(specs.getMetal().getId()));
        return productRepository.save(product);
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
        specs.setGemstone(gemstoneService.findById(specs.getGemstone().getId()));
        specs.setMetal(metalService.findById(specs.getMetal().getId()));
        return productSpecificationRepository.save(specs);
    }

    @Transactional
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
        return calculatePrice(findProductSpecificationById(productSpecificationId));
    }

    @Override
    public List<Product> findAllByOrderByIdDesc(Limit limit) {
        return productRepository.findAllByOrdersStatusIsOrderByIdDesc(OrderStatus.ORDER_COMPLETED, limit);
    }

    private Double calculatePrice (ProductSpecification specs) {
        Quotation quotation;
        try {
            quotation = specs.getProduct().getOrders().getLast().getQuotation();
        } catch (NoSuchElementException ex) {
            throw new RuntimeException("Cannot calculate produce price, there is no order found associate with this product", ex);
        } catch (NullPointerException ex) {
            throw new RuntimeException("Cannot calculate produce price, cannot fetch the parent object", ex);
        }
        return quotation.getFinalPrice();
    }
    //</editor-fold>

    private ProductSpecification mapNewSpecification (ProductSpecification oldSpecs, ProductSpecification newSpecs) {
        oldSpecs.setStyle(newSpecs.getStyle());
        oldSpecs.setType(newSpecs.getType());
        oldSpecs.setOccasion(newSpecs.getOccasion());
        oldSpecs.setLength(newSpecs.getLength());
        oldSpecs.setMetal(metalService.findById(newSpecs.getMetal().getId()));
        oldSpecs.setTexture(newSpecs.getTexture());
        oldSpecs.setChainType(newSpecs.getChainType());
        oldSpecs.setGemstone(gemstoneService.findById(newSpecs.getGemstone().getId()));
        oldSpecs.setGemstoneWeight(newSpecs.getGemstoneWeight());
        oldSpecs.setMetalWeight(newSpecs.getMetalWeight());
        return oldSpecs;
    }
}
