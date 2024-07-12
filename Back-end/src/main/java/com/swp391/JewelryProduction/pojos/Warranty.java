package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
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
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "warranty", fetch = FetchType.LAZY)
    @JsonBackReference("Order-Warranty")
    private Order order;
    @CreationTimestamp
    @ToString.Include
    @EqualsAndHashCode.Include
    private LocalDate issuedDate;
    @ToString.Include
    @EqualsAndHashCode.Include
    private LocalDate expiredDate;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String terms;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String description;
    @ToString.Include
    @EqualsAndHashCode.Include
    private LocalDate claimDate;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String claimContent;
}
