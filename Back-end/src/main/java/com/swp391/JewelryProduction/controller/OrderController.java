package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.QuotationItem;
import com.swp391.JewelryProduction.repositories.QuotationRepository;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.Random;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.getStateMachine;

@RestController
@RequestMapping("api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final StaffService staffService;
    private final QuotationRepository quotationRepository;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;


    @GetMapping("/list")
    public ResponseEntity<Response> list() {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("order-list", orderService.findAllOrders())
                .buildEntity();
    }

    @GetMapping("/{orderId}/detail")
    public ResponseEntity<Response> getDetail(@PathVariable("orderId") String orderId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("orderDetail", orderService.findOrderById(orderId))
                .response("saleStaffs", staffService.findAllByRole(Role.SALE_STAFF))
                .response("designStaffs", staffService.findAllByRole(Role.DESIGN_STAFF))
                .response("productionStaffs", staffService.findAllByRole(Role.PRODUCTION_STAFF))
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

    @PostMapping("/{orderId}/detail/edit-design")
    public ResponseEntity<Response> editDesign(@PathVariable("orderId") String orderId, @RequestBody Design design) {
        Order order = orderService.findOrderById(orderId);
        order.setDesign(design);
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
                .buildEntity();
    }

    @GetMapping("/test-quote")
    public ResponseEntity<Response> testQuotation() {
        Random rand = new Random();
        Quotation newQuote = Quotation.builder()
                .createdDate(LocalDate.now())
                .expiredDate(LocalDate.now().plusMonths(5))
                .title("Test Quotation")
                .quotationItems(new LinkedList<>())
                .build();
        for (int i = 0; i < 5; i++) {
            QuotationItem item = QuotationItem.builder()
                    .quotation(newQuote)
                    .name("Item " + i)
                    .quantity(rand.nextInt(5))
                    .unitPrice(rand.nextDouble(10, 100))
                    .build();
            item.setTotalPrice(item.getQuantity() * item.getUnitPrice());
            newQuote.getQuotationItems().add(item);
        }
        return Response.builder()
                .response("quotation", quotationRepository.save(newQuote))
                .buildEntity();
    }

    @PostMapping("/test-quote")
    public ResponseEntity<Response> testPostQuotation(@RequestBody Quotation quotation) {
        return Response.builder()
                .response("quotation", quotationRepository.save(quotation))
                .buildEntity();
    }
}
