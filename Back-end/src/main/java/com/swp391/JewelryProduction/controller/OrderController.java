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
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.product.ProductService;
import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.websocket.image.ImageService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
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
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getCurrentState;
import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getStateMachine;

@RestController
@RequestMapping("api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final ImageService imageService;
    private final ProductService productService;
    private final QuotationRepository quotationRepository;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;


    @GetMapping("/list")
    public ResponseEntity<Response> list() {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("orders", orderService.findAllOrders())
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
                        withPayload(OrderEvent.TRANSACTION_MAKE)
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

            Product product = order.getProduct();
            product.setImageURL(designUrl);
            productService.saveProduct(product);

            orderService.updateOrder(order);
    
            StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachine(orderId, stateMachineService);
            stateMachine.sendEvent(
                    Mono.just(MessageBuilder.
                            withPayload(OrderEvent.DES_MANA_PROCESS)
                            .build()
                    )
            ).subscribe();

            return Response.builder()
                    .status(HttpStatus.OK)
                    .message("Request sent successfully")
                    .response("designUrl", designUrl)
                    .buildEntity();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
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

//    @GetMapping("/assigned/{staffId}")
//    public ResponseEntity<Response> getAssignedOrder(
//            @PathVariable("staffId") String staffId,
//            @RequestParam("role") Role role
//    ) {
//        return Response.builder()
//                .message("Request sent successfully")
//                .response("order", orderService.findLatestUncompletedOrderByStaffAndRole(staffId, role))
//                .buildEntity();
//    }
}
