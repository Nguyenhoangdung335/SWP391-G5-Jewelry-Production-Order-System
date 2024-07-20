package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.swp391.JewelryProduction.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Transactions {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    private Integer id;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @ToString.Include
    @EqualsAndHashCode.Include
    private Double amount;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "paypal_payer_id")
    private String paypalPayerId;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "paypal_payment_id")
    private String paypalPaymentId;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "paypal_sale_id")
    private String paypalSaleId;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String status;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "transactions", fetch = FetchType.LAZY)
    @JsonBackReference("Order-Transactions")
    private Order order;
}
