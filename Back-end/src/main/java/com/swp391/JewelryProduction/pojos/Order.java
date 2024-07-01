package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "[Order]")
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(exclude = {"staffOrderHistory", "notifications", "relatedReports"})
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Order {
    @ToString.Include
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @GenericGenerator(
            name = "order_seq",
            type = IdGenerator.class,
            parameters = {
                    @Parameter(name = IdGenerator.INCREMENT_PARAM, value = "1"),
                    @Parameter(name = IdGenerator.VALUE_PREFIX_PARAMETER, value = "ORD"),
                    @Parameter(name = IdGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d")
            }
    )
    @Column(length = 8, nullable = false, updatable = false, unique = true)
    private String id;
    @ToString.Include
    private String name;
    @ToString.Include
    private double budget;
    @ToString.Include
    @Column(name = "date_created", nullable = false)
    private LocalDateTime createdDate;
    @ToString.Include
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @ToString.Include
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private Account owner;

    @ToString.Include
    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "quotation_id")
    @JsonManagedReference("Order-Quotation")
    private Quotation quotation;
    @ToString.Include
    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "design_id")
    @JsonManagedReference("Order-Design")
    private Design design;

    @OneToMany(
            mappedBy = "order",
            cascade = {CascadeType.MERGE, CascadeType.DETACH, CascadeType.REMOVE},
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<StaffOrderHistory> staffOrderHistory = new LinkedList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notification> notifications = new LinkedList<>();

    @ToString.Include
    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "product_id")
    @JsonManagedReference("Order-Product")
    private Product product;

    @JsonManagedReference("Order-Report")
    @OneToMany(mappedBy = "reportingOrder", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<Report> relatedReports = new LinkedList<>();
    @Transient
    private Staff saleStaff;
    @Transient
    private Staff designStaff;
    @Transient
    private Staff productionStaff;

    @ToString.Include
    public Staff getSaleStaff() {
        return getStaffByRole(Role.SALE_STAFF);
    }
    @ToString.Include
    public Staff getDesignStaff() {
        return getStaffByRole(Role.DESIGN_STAFF);
    }
    @ToString.Include
    public Staff getProductionStaff() {
        return getStaffByRole(Role.PRODUCTION_STAFF);
    }

    private Staff getStaffByRole(Role role) {
        if (staffOrderHistory != null) {
            for (StaffOrderHistory history : staffOrderHistory) {
                if (history.getStaff().getRole() == role) {
                    return history.getStaff();
                }
            }
        }
        return null;
    }

    public void setSaleStaff (Staff saleStaff) {
        this.saleStaff = saleStaff;
        staffOrderHistory.add(StaffOrderHistory.builder()
                .staffID(saleStaff.getId())
                .orderID(id)
                .staff(saleStaff)
                .order(this)
                .startDate(LocalDateTime.now())
                .build()
        );
    }

    public void setDesignStaff (Staff designStaff) {
        this.designStaff = designStaff;
        staffOrderHistory.add(StaffOrderHistory.builder()
                .staffID(designStaff.getId())
                .orderID(id)
                .staff(designStaff)
                .order(this)
                .startDate(LocalDateTime.now())
                .build()
        );
    }

    public void setProductionStaff (Staff productionStaff) {
        this.productionStaff = productionStaff;
        staffOrderHistory.add(StaffOrderHistory.builder()
                .staffID(productionStaff.getId())
                .orderID(id)
                .staff(productionStaff)
                .order(this)
                .startDate(LocalDateTime.now())
                .build()
        );
    }
}
