package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Notification")
public class Notification {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    private Integer id;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = true)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Order order;

    @ToString.Include
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account receiver;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "is_delivered")
    private boolean delivered;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "is_read")
    private boolean read;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "is_option")
    private boolean isOption;
}
