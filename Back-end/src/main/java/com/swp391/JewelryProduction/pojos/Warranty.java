package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "warranty")
public class Warranty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(mappedBy = "warranty", fetch = FetchType.LAZY)
    @JsonBackReference("Order-Warranty")
    private Order order;
    @CreationTimestamp
    private LocalDate issuedDate;
    private LocalDate expiredDate;
    private String terms;
    private String description;
    private LocalDate claimDate;
    private String claimContent;
}
