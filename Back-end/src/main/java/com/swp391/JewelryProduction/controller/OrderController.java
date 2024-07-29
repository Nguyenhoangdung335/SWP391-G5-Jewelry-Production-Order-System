package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.repositories.QuotationRepository;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.product.ProductService;
import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.websocket.image.ImageService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDateTime;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.Keywords.*;
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getStateMachine;

@RestController
@RequestMapping("api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final ImageService imageService;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    @GetMapping("/{page}")
    public ResponseEntity<Response> getOrder(
            @PathVariable("page") int page,
            @RequestParam(value = "accountId", required = true) String accountId,
            @RequestParam(value = "role", required = true) Role role,
            @RequestParam(value = "status", defaultValue = "ALL") OrderStatus status,
            @RequestParam(value = "size", defaultValue = "5") int elementsPerPage
    ) {
        Page<Order> orderPage = orderService.findOrdersByPageAndStatusBasedOnRole(accountId, role, status, page, elementsPerPage);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("orders", orderPage.getContent())
                .response("totalPages", orderPage.getTotalPages())
                .response("totalElements", orderPage.getTotalElements())
                .buildEntity();
    }

    @GetMapping("/{orderId}/detail")
    public ResponseEntity<Response> getDetail(@PathVariable("orderId") String orderId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("orderDetail", orderService.findOrderById(orderId))
                .buildEntity();
    }

    @PostMapping("/{orderId}/detail/assign-staff")
    public ResponseEntity<Response> assignStaff(@PathVariable("orderId") String orderId, @RequestBody StaffGroup staffGroup) throws MessagingException {
        Order order = orderService.assignStaff(orderId, staffGroup);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Assign Staffs successfully for order "+order.getId())
                .response("orderID", order.getId())
                .buildEntity();
    }

    @PostMapping("/{orderId}/detail/edit-quote")
    public ResponseEntity<Response> editQuote(@PathVariable("orderId") String orderId, @RequestBody Quotation quotation) {
        Order order = orderService.findOrderById(orderId);
        order.setQuotation(quotation);
        orderService.updateOrder(order);

        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId, stateMachineService);
        stateMachine.sendEvent(
                Mono.just(MessageBuilder.
                        withPayload(OrderEvent.QUO_MANA_PROCESS)
                        .build()
                )
        ).subscribe();

        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }

    @PostMapping("/{orderId}/detail/transaction-confirm")
    public ResponseEntity<Response> handleTransactionConfirm (
            @PathVariable("orderId") String orderId,
            @RequestParam("confirmed") Boolean confirmed
    ) {
        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId, stateMachineService);
        stateMachine.getExtendedState().getVariables().put(TRANSACTION_CHOICE, confirmed);
        stateMachine.sendEvent(
                Mono.just(MessageBuilder.
                        withPayload(OrderEvent.BET_TRANSACTION_MAKE)
                        .build()
                )
        ).subscribe();

        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .buildEntity();
    }

    @PostMapping("/{orderId}/detail/edit-design")
    public ResponseEntity<Response> editDesign(
            @PathVariable("orderId") String orderId,
            @RequestParam MultipartFile file
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

            order = orderService.updateOrder(order);

            return Response.builder()
                    .status(HttpStatus.OK)
                    .message("Request sent successfully")
                    .response("designUrl", designUrl)
                    .response("designId", order.getDesign().getId())
                    .buildEntity();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @PostMapping("/{orderId}/detail/edit-product")
    public ResponseEntity<Response> editFinalProduct(
            @PathVariable("orderId") String orderId,
            @RequestParam MultipartFile file
    ) {
        try {
            String finalProductURL = imageService.uploadImage(file, "proof-images");
            Order order = orderService.findOrderById(orderId);
            order.setProofUrl(finalProductURL);

            order = orderService.updateOrder(order);

            return Response.builder()
                    .status(HttpStatus.OK)
                    .message("Request sent successfully")
                    .response("productUrl", finalProductURL)
                    .response("productId", order.getProduct().getId())
                    .buildEntity();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<Response> cancelOrder(@PathVariable("orderId") String orderId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Successfully cancel order "+orderId)
                .response("orderDetail", orderService.cancelOrder(orderId))
                .buildEntity();
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<Response> getOrderByAccountId(
            @PathVariable("accountId") String accountId
    ) {
        return Response.builder()
                .message("Request sent successfully")
                .response("orders", orderService.findOrderByAccountId(accountId).stream().map(orderService::mappedToResponse).toList())
                .buildEntity();
    }

//    @PostMapping("/make-by-template")
//    public ResponseEntity<Response> makeOrderByTemplate () {
//
//    }
}
