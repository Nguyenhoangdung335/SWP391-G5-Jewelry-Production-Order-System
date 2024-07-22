package com.swp391.JewelryProduction.services.transaction;

import com.paypal.api.payments.Payment;
import com.paypal.api.payments.RelatedResources;
import com.paypal.api.payments.Sale;
import com.paypal.api.payments.Transaction;
import com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.TransactionStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Transactions;
import com.swp391.JewelryProduction.repositories.TransactionRepository;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.Keywords.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository transactionRepository;
    private final OrderService orderService;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Transactions createTransaction(Payment payment, Order order) {
        Transactions transactions = null;
        try {
             transactions = Transactions.builder()
                     .order(order)
                     .dateCreated(LocalDateTime.now())
                     .status(TransactionStatus.CREATED)
                     .paypalPaymentId(payment.getId())
                     .build();
             order.setTransactions(transactions);
             transactions = orderService.updateOrder(order).getTransactions();

        } catch (NumberFormatException ex) {
            log.error("Cannot parse double value for the transaction");
            throw new RuntimeException("System error, unable to format transaction amount", ex);
        }

        return transactions;
    }

//    public Transactions updateTransactionStatus (Order order, Payment payment, TransactionStatus status) {
//        Transactions transactions = order.getTransactions();
//        if (transactions == null|| !transactions.getStatus().equals(TransactionStatus.CREATED))
//            throw new IllegalArgumentException("Cannot make bet transaction, transaction does not exist or does not have required status");
//    }

    @Override
    public Transactions makeBetTransaction(Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null|| !transactions.getStatus().equals(TransactionStatus.CREATED))
            throw new IllegalArgumentException("Cannot make bet transaction, transaction does not exist or does not have required status");
        try {
            transactions.setStatus(TransactionStatus.BET);
            transactions.setPaypalPaymentId(payment.getId());
            transactions.setAmount(Double.parseDouble(payment.getTransactions().getFirst().getAmount().getTotal()));
        } catch (Exception ex) {
            log.error("Unable to make bet transaction for order id "+ order.getId());
        }

        return transactions;
    }

    @Override
    @Transactional
    public Transactions saveTransaction(Transactions transactions) {
        return transactionRepository.save(transactions);
    }

    @Transactional
    @Override
    public Transactions updateTransactionsStateByPayment(Payment payment, Order order) {
        switch (order.getStatus()) {
            case OrderStatus.AWAIT_BET_TRANSACTION -> {
                return makeBetTransactions(payment, order);
            } case OrderStatus.AWAIT_REMAIN_TRANSACTION -> {
                return makeRemainingTransactions(payment, order);
            } default -> {
                throw new RuntimeException("Incorrect Order Status, Unable to make transaction");
            }
        }
    }

    private Transactions makeBetTransactions(Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null)
            throw new IllegalArgumentException("Cannot make bet transaction, transaction does not exist or does not have required status");

        transactions.setStatus(TransactionStatus.BET);
        transactions.setDateUpdated(LocalDateTime.now());
        transactions.setPaypalSaleId(retrieveSale(payment).getId());

        return transactionRepository.save(transactions);
    }

    private Transactions makeRemainingTransactions (Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null)
            throw new IllegalArgumentException("Cannot make bet transaction, transaction does not exist or does not have required status");

        transactions.setStatus(TransactionStatus.COMPLETED);
        transactions.setDateUpdated(LocalDateTime.now());
        transactions.setPaypalSaleId(retrieveSale(payment).getId());

        return transactionRepository.save(transactions);
    }

    @Override
    public Transactions findTransactionById(Integer id) {
        return transactionRepository
                .findById(id)
                .orElseThrow(
                        () -> new ObjectNotFoundException("Transactions with id "+id+" does not exist")
                );
    }

    @Override
    public Transactions findTransactionByPaypalPaymentId(String paypalPaymentId) {
        return transactionRepository
                .findByPaypalPaymentId(paypalPaymentId)
                .orElseThrow(
                        () -> new ObjectNotFoundException("Paypal payment id "+paypalPaymentId+" does not exist in the system")
                );
    }

    @Override
    public Transactions refundTransaction(Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null )
            throw new IllegalArgumentException("Cannot refund transaction, transaction does not exist or does not have required status");

        transactions.setStatus(TransactionStatus.REFUNDED);
        transactions.setAmount(0.0);
        transactions.setDateUpdated(LocalDateTime.now());
        transactions.setPaypalSaleId(retrieveSale(payment).getId());

        return transactionRepository.save(transactions);
    }

    @Override
    public void handleTransactionChoice(Transactions transactions, String orderId, boolean choice) {
        Map<String, Object> variable = new HashMap<>();
        variable.put(TRANSACTIONS_ID, transactions.getPaypalPaymentId());
        variable.put(TRANSACTION_CHOICE, choice);
        StateMachineUtil.sendEvent(stateMachineService, orderId, getEventByStatus(transactions.getOrder().getStatus()), variable);
    }

    private OrderEvent getEventByStatus (OrderStatus status) {
        switch(status) {
            case OrderStatus.AWAIT_BET_TRANSACTION -> {
                return OrderEvent.BET_TRANSACTION_MAKE;
            } case OrderStatus.AWAIT_REMAIN_TRANSACTION -> {
                return OrderEvent.REMAIN_TRANSACTION_MAKE;
            } default ->
                    throw new RuntimeException("Incorrect Order Status, Unable to make transaction");
        }
    }

    private Sale retrieveSale(Payment payment) {
        if (payment != null) {
            List<Transaction> transactionList = payment.getTransactions();
            if (transactionList != null && !transactionList.isEmpty()) {
                for (Transaction transaction : transactionList) {
                    List<RelatedResources> relatedResources = transaction.getRelatedResources();
                    if (relatedResources != null && !relatedResources.isEmpty()) {
                        for (RelatedResources resource : relatedResources) {
                            Sale sale = resource.getSale();
                            if (sale != null) {
                                return resource.getSale();
                            } else {
                                throw new ObjectNotFoundException("Sale object for payment "+payment.getId()+" cannot be found");
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
}
