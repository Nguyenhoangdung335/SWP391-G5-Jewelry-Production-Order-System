package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.services.design.DesignService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.websocket.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController
@RequestMapping("/design")
public class DesignController {

    private final ImageService imageService;
    private final OrderService orderService;
    private final DesignService designService;

    @PostMapping("/upload/{orderId}")
    public ResponseEntity<Response> uploadDesign(
            @RequestParam MultipartFile file,
            @PathVariable String orderId
    ) {
        try {
            String designUrl = imageService.uploadImage(file, "design-images");

            Order order = orderService.findOrderById(orderId);
            Design design = Design.builder()
                    .order(order)
                    .designLink(designUrl)
                    .lastUpdated(LocalDateTime.now())
                    .build();
            order.setDesign(design);
            orderService.updateOrder(order);

            return Response.builder()
                    .status(HttpStatus.OK)
                    .message("Upload design image successfully")
                    .response("designUrl", designUrl)
                    .buildEntity();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Upload design image failed")
                    .buildEntity();
        }
    }
}
