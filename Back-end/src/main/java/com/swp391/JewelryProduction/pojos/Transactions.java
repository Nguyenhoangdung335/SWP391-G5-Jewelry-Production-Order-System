package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @Id
    @GeneratedValue
    private Integer id;

    @ToString.Include
    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @ToString.Include
    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;

    @ToString.Include
    private Double amount;

    @ToString.Include
    @Column(name = "paypal_payer_id")
    private String paypalPayerId;

    @ToString.Include
    @Column(name = "paypal_payment_id")
    private String paypalPaymentId;

    @ToString.Include
    @Column(name = "paypal_sale_id")
    private String paypalSaleId;

    @ToString.Include
    private String status;

    @OneToOne(mappedBy = "transactions", fetch = FetchType.LAZY)
    @JsonBackReference("Order-Transactions")
    private Order order;
}
