package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.swp391.JewelryProduction.util.embeddedID.StaffOrderID;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Staff_Order_History")
@IdClass(StaffOrderID.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StaffOrderHistory {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @Column(name = "staff_id", length = 8, nullable = false)
    private String staffID;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    @Column(name = "order_id", length = 8, nullable = false)
    private String orderID;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "start_date")
    private LocalDateTime startDate;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "end_date")
    private LocalDateTime endDate;

    @ToString.Include
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ToString.Include
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "order_id")
    private Order order;

}
