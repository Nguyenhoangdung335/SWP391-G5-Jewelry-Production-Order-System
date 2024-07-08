package com.swp391.JewelryProduction.services.transaction;

import com.paypal.api.payments.Payment;
import com.paypal.api.payments.RelatedResources;
import com.paypal.api.payments.Sale;
import com.paypal.api.payments.Transaction;
import com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Transactions;
import com.swp391.JewelryProduction.repositories.TransactionRepository;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.Keywords.*;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository transactionRepository;
    private final OrderService orderService;
    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Transactions createTransaction(Payment payment, Order order) {
        Transaction transaction = payment.getTransactions().getFirst();
        Transactions transactions = null;

        try {
             transactions = Transactions.builder()
                     .order(order)
                     .dateCreated(LocalDateTime.now())
                     .amount(Double.parseDouble(transaction.getAmount().getTotal()))
                     .paypalPayerId(payment.getPayer().getPayerInfo().getPayerId())
                     .status(payment.getState())
                     .build();
             transactions = transactionRepository.save(transactions);

        } catch (NumberFormatException ex) {
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
    public Transactions updateTransactionsStateByPayment(Payment payment) {
        Transactions transactions = transactionRepository
                .findByPaypalPaymentId(payment.getId())
                .orElseThrow(
                        () -> new ObjectNotFoundException("Transactions with payment id "+payment.getId()+" does not exist in the system")
                );

        transactions.setStatus(payment.getState());
        transactions.setDateUpdated(LocalDateTime.now());
        transactions.setPaypalSaleId(retrieveSaleId(payment));

        return transactionRepository.save(transactions);
    }

    private String retrieveSaleId (Payment payment) {
        if (payment != null) {
            List<Transaction> transactionList = payment.getTransactions();
            if (transactionList != null && !transactionList.isEmpty()) {
                for (Transaction transaction : transactionList) {
                    List<RelatedResources> relatedResources = transaction.getRelatedResources();
                    if (relatedResources != null && !relatedResources.isEmpty()) {
                        for (RelatedResources resource : relatedResources) {
                            Sale sale = resource.getSale();
                            if (sale != null) {
                                return sale.getId();
                            }
                        }
                    }
                }
            }
        }
        return null;
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
    public void handleTransactionChoice(Transactions transactions, String orderId, boolean choice) {
        StateMachine<OrderStatus, OrderEvent> stateMachine = StateMachineUtil.getStateMachine(orderId, stateMachineService);
        stateMachine.getExtendedState().getVariables().put(TRANSACTIONS_ID, transactions.getPaypalPaymentId());
        stateMachine.getExtendedState().getVariables().put(TRANSACTION_CHOICE, choice);
        stateMachine.sendEvent(
                Mono.just(MessageBuilder
                        .withPayload(OrderEvent.TRANSACTION_MAKE)
                        .build()
                )
        ).subscribe();
    }
}
