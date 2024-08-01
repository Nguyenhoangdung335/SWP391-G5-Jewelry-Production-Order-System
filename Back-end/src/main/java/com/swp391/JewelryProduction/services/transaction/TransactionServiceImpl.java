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
import lombok.Getter;
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
    @Getter
    private static final List<OrderStatus> noRefundBefore = List.of(OrderStatus.REQ_AWAIT_APPROVAL, OrderStatus.AWAIT_ASSIGN_STAFF, OrderStatus.IN_EXCHANGING, OrderStatus.QUO_AWAIT_MANA_APPROVAL, OrderStatus.QUO_AWAIT_CUST_APPROVAL, OrderStatus.AWAIT_BET_TRANSACTION);
    @Getter
    private static final Map<OrderStatus, Double> partialRefund = Map.of(OrderStatus.IN_DESIGNING, 0.9, OrderStatus.DES_AWAIT_MANA_APPROVAL, 0.9, OrderStatus.DES_AWAIT_CUST_APPROVAL, 0.9, OrderStatus.IN_PRODUCTION, 0.5, OrderStatus.PRO_AWAIT_APPROVAL, 0.3, OrderStatus.AWAIT_REMAIN_TRANSACTION, 0.1);
    @Getter
    private static final List<OrderStatus> noRefundAfter = List.of(OrderStatus.ORDER_COMPLETED, OrderStatus.CANCEL, OrderStatus.ON_DELIVERING, OrderStatus.DELIVERED_AWAIT_APPROVAL);


    private final TransactionRepository transactionRepository;
    private final OrderService orderService;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Transactions createTransaction(Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null) {
            return makeNewTransaction(payment, order);
        }
        return transactions;
    }

    private Transactions makeNewTransaction (Payment payment, Order order) {
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
        try {
            transactions.setAmount(Double.parseDouble(payment.getTransactions().getFirst().getAmount().getTotal()));
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Cannot parse amount from paypal transaction");
        }
        transactions.setStatus(TransactionStatus.BET);
        transactions.setDateUpdated(LocalDateTime.now());
        transactions.setPaypalSaleId(retrieveSale(payment).getId());
        return transactionRepository.save(transactions);
    }

    private Transactions makeRemainingTransactions (Payment payment, Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null)
            throw new IllegalArgumentException("Cannot make bet transaction, transaction does not exist or does not have required status");
        try {
            double remainingAmount = Double.parseDouble(payment.getTransactions().getFirst().getAmount().getTotal());
            transactions.setAmount(transactions.getAmount() + remainingAmount);
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Cannot parse amount from paypal transaction");
        }
        transactions.setStatus(TransactionStatus.COMPLETED);
        transactions.setDateUpdated(LocalDateTime.now());
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
    public Transactions refundTransaction(Order order) {
        Transactions transactions = order.getTransactions();
        if (transactions == null )
            throw new IllegalArgumentException("Cannot refund transaction, transaction does not exist or does not have required status");

        transactions.setStatus(TransactionStatus.REFUNDED);
        Double initialAmount = transactions.getAmount();
        transactions.setAmount(initialAmount - initialAmount * getRefundPercentByPolicy(order));
        transactions.setDateUpdated(LocalDateTime.now());

        return transactionRepository.save(transactions);
    }

    @Override
    public Double getRefundPercentByPolicy(Order order) {
        if (noRefundBefore.contains(order.getStatus()))
            return 0.0;
        else return partialRefund.getOrDefault(order.getStatus(), 0.0);
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
