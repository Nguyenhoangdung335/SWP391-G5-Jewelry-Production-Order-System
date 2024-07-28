package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.quotation.QuotationService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/quotation/{orderId}")
@RequiredArgsConstructor
public class    QuotationController {
    private final QuotationService quotationService;
    private final OrderService orderService;

    @GetMapping("/get-quote")
    public ResponseEntity<Response> getQuotation(@PathVariable String orderId) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Quotation of order id "+orderId+" successfully fetched.")
                .response("quotation", quotationService.findQuotationByOrderId(orderId))
                .buildEntity();
    }

    @PostMapping("/submit")
    public ResponseEntity<Response> createQuotation(@PathVariable String orderId, @RequestBody Quotation quotation) {
        quotation = quotationService.saveQuotation(quotation, orderService.findOrderById(orderId));
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Quotation has been saved successfully")
                .response("quotation", quotation)
                .buildEntity();
    }

    @DeleteMapping("/delete/{quotationID}")
    public ResponseEntity<Response> removeQuotation(@PathVariable String orderId, @PathVariable("quotationID") String quotationID) {
        Order order = orderService.findOrderById(orderId);
        order.setQuotation(null);
        orderService.updateOrder(order);
        quotationService.deleteQuotationByID(quotationID);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Quotation has been deleted successfully")
                .buildEntity();
    }

    @GetMapping("/default-quote")
    public ResponseEntity<Response> getDefaultItem (@PathVariable("orderId") String orderId) {
        Order order = orderService.findOrderById(orderId);
        return Response.builder()
                .response("quotation", quotationService.getDefaultQuotation(order))
                .buildEntity();
    }
}
