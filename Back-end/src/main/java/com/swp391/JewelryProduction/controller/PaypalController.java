package com.swp391.JewelryProduction.controller;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.paypal.api.payments.*;
import com.paypal.base.rest.PayPalRESTException;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.PaymentMethods;
import com.swp391.JewelryProduction.enums.TransactionStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.Transactions;
import com.swp391.JewelryProduction.services.PaypalService;
import com.swp391.JewelryProduction.services.email.EmailService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.order.OrderServiceImpl;
import com.swp391.JewelryProduction.services.quotation.QuotationService;
import com.swp391.JewelryProduction.services.transaction.TransactionService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.swp391.JewelryProduction.util.UrlUtils.appendQueryParam;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/payment")
public class PaypalController {

    private final PaypalService paypalService;
    private final QuotationService quotationService;
    private final OrderService orderService;
    private final TransactionService transactionService;

    private final LoadingCache<String, String> urlCache = CacheBuilder.newBuilder()
            .build(new CacheLoader<String, String>() {
                @Override
                public String load(String key) throws Exception {
                    return "";
                }
            });
    private final OrderServiceImpl orderServiceImpl;

//    @PostMapping("/bet/create/{orderId}")
//    public ResponseEntity<Response> createBet(
//            @RequestParam("quotationId") String quotationId,
//            @PathVariable("orderId") String orderId,
//            @RequestParam(name = "resultURL", required = false, defaultValue = "") String resultURL,
//            HttpServletRequest request
//    ) {
//        String baseURL = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
//        String cancelURL = baseURL + "/api/payment/cancel?orderId="+orderId;
//        String successURL = baseURL + "/api/payment/success?orderId="+orderId;
//
//        urlCache.put("resultURL" + "-" + orderId, resultURL);
//    }

    @PostMapping("/create/{orderId}")
    public ResponseEntity<Response> createPayment(
            @PathVariable("orderId") String orderId,
            @RequestParam("quotationId") String quotationId,
            @RequestParam(name = "resultURL") String resultURL,
            @RequestParam(name = "method", defaultValue = "PAYPAL") PaymentMethods method,
            HttpServletRequest request
    ) {
        String baseURL = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        String cancelURL = baseURL + "/api/payment/cancel?orderId="+orderId;
        String successURL = baseURL + "/api/payment/success?orderId="+orderId;
        urlCache.put(String.format("resultURL-%s", orderId), resultURL);
        try {
            Quotation quotation = quotationService.findById(quotationId);
            Order order = orderService.findOrderById(orderId);

            Payment payment = paypalService.makePayment(
                    quotation.getTotalPrice(),
                    "USD",
                    method.name(),
                    "sale",
                    quotation.getTitle(),
                    cancelURL,
                    successURL,
                    order
            );
            transactionService.createTransaction(payment, order);

            for (Links links: payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    log.info("Endpoint /api/payment/create: redirect to " + links.getHref());
                    return Response.builder()
                            .response("url", links.getHref())
                            .buildEntity();
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message("Error creating PayPal payment")
                .buildEntity();
    }

    @GetMapping("/success")
    public ResponseEntity<Void> paymentSuccess(
            @RequestParam("orderId") String orderId,
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId
    ) {
        String resultURL = buildResultURL(orderId, "success");

        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);

            Order order = orderService.findOrderById(orderId);

            Transactions transactions = transactionService.updateTransactionsStateByPayment(payment, order);
            transactionService.handleTransactionChoice(transactions, orderId, true);
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(resultURL))
                .build();
    }

    @GetMapping("/cancel")
    public ResponseEntity<Void> paymentCancel(@RequestParam("orderId") String orderId) {
        String resultURL = buildResultURL(orderId, "cancel");

        Order order = orderService.findOrderById(orderId);
        transactionService.handleTransactionChoice(order.getTransactions(), orderId, false);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(resultURL))
                .build();
    }

    private String buildResultURL (String orderId, String status) {
        String resultURL = urlCache.getIfPresent("resultURL" + "-" + orderId);
        if (resultURL == null)
            throw new RuntimeException("Server Error, the transaction result page url cannot be found");
        return appendQueryParam(resultURL, "status", status);
    }
}