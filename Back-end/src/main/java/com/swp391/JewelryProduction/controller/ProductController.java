package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.ProductDTO;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.services.product.ProductService;
import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.websocket.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;

import static com.swp391.JewelryProduction.util.CustomFormatter.roundToDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/products")
public class ProductController {
    private final ProductService productService;
    private final ImageService imageService;

    //<editor-fold desc="PRODUCT ENDPOINTS" defaultstate="collapsed">
    @GetMapping("")
    public ResponseEntity<Response> getProducts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "isFinished", defaultValue = "false") boolean isFinished
    ) {
        Page<Product> productPage = productService.findAll(page, size, isFinished);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Get products successfully")
                .response("products", productPage.getContent())
                .response("totalPages", productPage.getTotalPages())
                .response("totalElements", productPage.getTotalElements())
                .buildEntity();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Response> getProductById(@PathVariable String productId) {
        return Response.builder()
                .message("Request send successfully")
                .response("product", productService.findById(productId))
                .buildEntity();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Response> removeProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Product with id "+productId+" has been deleted successfully")
                .buildEntity();
    }

    @PostMapping("")
    public ResponseEntity<Response> createProduct(@RequestBody Product product) {
        productService.saveProduct(product);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request send successfully.")
                .buildEntity();
    }

    @GetMapping("/latest_product")
    public ResponseEntity<Response> getLatestProduct() {
        return Response.builder()
                .status(HttpStatus.OK)
                .response("products", productService.findAllByOrderByIdDesc(Limit.of(5)))
                .message("Request send successfully.")
                .buildEntity();
    }

    @PostMapping("/image")
    public String submitProductImage (
            @RequestParam MultipartFile imageFile
    ) {
        try {
            return imageService.uploadImage(imageFile, "product-images");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
    //</editor-fold>

    //<editor-fold desc="PRODUCT SPECIFICATION ENDPOINTS" defaultstate="collapsed">
    @GetMapping("/customize")
    public ResponseEntity<Response> getAllSpecification (
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size
    ) {
        Page<ProductSpecification> specificationPage = productService.findAllSpecification(page, size);
        return Response.builder()
                .message("Get all Specifications successully")
                .response("specifications", specificationPage.getContent())
                .response("totalPages", specificationPage.getTotalPages())
                .response("totalElements", specificationPage.getTotalElements())
                .buildEntity();
    }

    @GetMapping("/customize/{specificationId}")
    public ResponseEntity<Response> getSpecificationById (
            @PathVariable int specificationId
    ) {
        ProductSpecification specs = productService.findProductSpecificationById(specificationId);
        return Response.builder()
                .message("Get Specification with id "+specs.getId()+" successfully")
                .response("productSpecification", specs)
                .buildEntity();
    }

    @PostMapping("/customize")
    public ResponseEntity<Response> saveCustomization(@RequestBody ProductSpecification specs) {
        specs = productService.saveSpecification(specs);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Create Specification with "+specs.getId()+" successfully")
                .response("productSpecification", specs)
                .buildEntity();
    }

    @PutMapping("/customize/{specificationId}")
    public ResponseEntity<Response> updateCustomization(
            @PathVariable int specificationId,
            @RequestBody ProductSpecification specs
    ) {
        specs = productService.updateSpecification(specificationId ,specs);
        return Response.builder()
                .message("Update Specification with id "+specs.getId()+" successfully")
                .response("productSpecification", specs)
                .buildEntity();
    }

    @DeleteMapping("/customize/{specificationId}")
    public ResponseEntity<Response> deleteCustomization(@PathVariable int specificationId) {
        productService.deleteSpecificationById(specificationId);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Delete Specification with id "+specificationId+" successfully")
                .buildEntity();
    }

    @GetMapping("/customize/calculate-price/{specificationId}")
    public ResponseEntity<Double> calculateRoughProductPrice (@PathVariable int specificationId) {
        Double roughPrice = productService.calculateRoughProductPrice(specificationId);
        return ResponseEntity.ok(roundToDecimal(roughPrice, 2));
    }
    //</editor-fold>
}
