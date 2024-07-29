package com.swp391.JewelryProduction.services.transaction;

import com.paypal.api.payments.Payment;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.TransactionStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Transactions;
import org.springframework.transaction.annotation.Transactional;

public interface TransactionService {
    Transactions createTransaction (Payment payment, Order order);

    Transactions makeBetTransaction(Payment payment, Order order);

    Transactions saveTransaction (Transactions transactions);

    @Transactional
    Transactions updateTransactionsStateByPayment(Payment payment, Order order);

    Transactions findTransactionById(Integer id);

    Transactions findTransactionByPaypalPaymentId(String paypalPaymentId);

    Transactions refundTransaction(Order order);

    Double getRefundPercentByPolicy(Order order);

    void handleTransactionChoice(Transactions transactions, String orderId, boolean choice);
}
