package com.swp391.JewelryProduction.controller;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.paypal.api.payments.*;
import com.paypal.base.rest.PayPalRESTException;
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

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Controller
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

    @PostMapping("/create/{orderId}")
    public RedirectView createPayment(
            @RequestBody String quotationId,
            @PathVariable("orderId") String orderId,
            @RequestParam(name = "resultURL", required = false, defaultValue = "") String resultURL,
            HttpServletRequest request
    ) {
        String baseURL = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
        String cancelURL = baseURL + "/api/payment/cancel?orderId="+orderId;
        String successURL = baseURL + "/api/payment/success?orderId="+orderId;
        String errorURL = baseURL + "/api/payment/error?orderId="+orderId;

        urlCache.put("resultURL", resultURL);

        try {
            Quotation quotation = quotationService.findById(quotationId);
            Order order = orderService.findOrderById(orderId);

            Payment payment = paypalService.makePayment(
                    quotation.getTotalPrice(),
                    "USD",
                    "Paypal Wallet payment",
                    "sale",
                    quotation.getTitle(),
                    cancelURL,
                    successURL,
                    order
            );

            for (Links links: payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    log.info("Endpoint /api/payment/create: redirect to " + links.getHref());
                    return new RedirectView(links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return new RedirectView(errorURL);
    }

    @GetMapping("/success")
    public RedirectView paymentSuccess(
            @RequestParam("orderId") String orderId,
            @RequestParam("paymentId") String paymentId,
            @RequestParam("payerID") String payerId
    ) {
        String resultURL = urlCache.getIfPresent("resultURL");
        if (resultURL == null)
            throw new RuntimeException("Server Error, the transaction result page url cannot be found");
        resultURL += "?status=success";

        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            Transactions transactions = transactionService.findTransactionByPaypalPaymentId(paymentId);
            log.info("Endpoint /api/payment/success: Successful payment execution for paymentID " + payment.getId() + " of payerID " + payerId);
            transactionService.handleTransactionChoice(transactions, orderId, true);
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return new RedirectView(resultURL);
    }

    @GetMapping("/cancel")
    public RedirectView paymentCancel(@RequestParam("orderId") String orderId) {
        String resultURL = urlCache.getIfPresent("resultURL");
        if (resultURL == null)
            throw new RuntimeException("Server Error, the transaction result page url cannot be found");
        resultURL += "?status=cancel";

        Order order = orderService.findOrderById(orderId);
        transactionService.handleTransactionChoice(order.getTransactions(), orderId, false);
        return new RedirectView(resultURL);
    }

    @GetMapping("/error")
    public RedirectView paymentError(@RequestParam("orderId") String orderId) {
        String resultURL = urlCache.getIfPresent("resultURL");
        if (resultURL == null)
            throw new RuntimeException("Server Error, the transaction result page url cannot be found");
        resultURL += "?status=error";

        return new RedirectView(resultURL);
    }

    @GetMapping("/receipt")
    public void generateReceipt(@RequestBody String paymentId) {
        Payment payment = null;
        try {
            payment = paypalService.getPaymentDetails(paymentId);
            List<Transaction> transactions = payment.getTransactions();
            if (!transactions.isEmpty()) {
                Transaction transaction = transactions.getFirst();
                List<RelatedResources> relatedResources = transaction.getRelatedResources();
                if (!relatedResources.isEmpty()) {
                    Sale sale = paypalService.getSaleDetails(relatedResources.getFirst().getSale().getId());
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
    }
}