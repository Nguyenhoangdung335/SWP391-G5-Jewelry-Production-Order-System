package com.swp391.JewelryProduction.services;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.services.transaction.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PaypalService {

    private final APIContext apiContext;
    private final TransactionService transactionService;

    public Payment makePayment(
            Double total,
            String currency,
            String method,
            String intent,
            String description,
            String cancelURL,
            String successURL,
            Order order
    ) throws PayPalRESTException {

        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(
                String.format(
                        Locale.forLanguageTag(currency),
                        "%.2f", total
                )
        );

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelURL);
        redirectUrls.setReturnUrl(successURL);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        payment.setRedirectUrls(redirectUrls);

        payment = payment.create(apiContext);

        transactionService.createTransaction(payment, order);

        return payment;
    }

    public Payment executePayment (
            String paymentID,
            String payerID
    ) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentID);

        PaymentExecution execution = new PaymentExecution();
        execution.setPayerId(payerID);
        payment = payment.execute(apiContext, execution);

        transactionService.updateTransactionsStateByPayment(payment);

        return payment;
    }

    public Payment getPaymentDetails(String paymentId) throws PayPalRESTException {
        return Payment.get(apiContext, paymentId);
    }

    public Sale getSaleDetails(String saleId) throws PayPalRESTException {
        return Sale.get(apiContext, saleId);
    }
}
