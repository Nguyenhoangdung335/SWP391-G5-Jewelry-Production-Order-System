package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.*;
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
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {
    @ToString.Include
    @EqualsAndHashCode.Include
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
    @EqualsAndHashCode.Include
    private String name;

    @ToString.Include
    @EqualsAndHashCode.Include
    private double budget;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "date_created", nullable = false)
    private LocalDateTime createdDate;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "date_completed")
    private LocalDateTime completedDate;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "owner_id")
    private Account owner;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "quotation_id")
    @JsonManagedReference("Order-Quotation")
    private Quotation quotation;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "design_id")
    @JsonManagedReference("Order-Design")
    private Design design;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "transaction_id")
    @JsonManagedReference("Order-Transactions")
    private Transactions transactions;

    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "warranty_id")
    @JsonManagedReference("Order-Warranty")
    private Warranty warranty;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "is_from_template")
    @Builder.Default
    private boolean fromTemplate = false;

    @JsonIgnore
    @OneToMany(
            mappedBy = "order",
            cascade = {CascadeType.MERGE, CascadeType.DETACH, CascadeType.REMOVE},
            fetch = FetchType.LAZY
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<StaffOrderHistory> staffOrderHistory = new LinkedList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonManagedReference("Order-Notification")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Notification> notifications = new LinkedList<>();

    @JsonManagedReference("Order-Report")
    @OneToMany(mappedBy = "reportingOrder", fetch = FetchType.LAZY)
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Report> relatedReports = new LinkedList<>();

    @EqualsAndHashCode.Include
    @ToString.Include
    @Column(length = 1024)
    private String proofUrl;

    @ToString.Include
    @Transient
    private Staff saleStaff;

    @ToString.Include
    @Transient
    private Staff designStaff;

    @ToString.Include
    @Transient
    private Staff productionStaff;

    //<editor-fold desc="ADDITIONAL GETTERS AND SETTERS" defaultstate="collapsed">
    public Staff getSaleStaff() {
        return getStaffByRole(Role.SALE_STAFF);
    }
    public Staff getDesignStaff() {
        return getStaffByRole(Role.DESIGN_STAFF);
    }
    public Staff getProductionStaff() {
        return getStaffByRole(Role.PRODUCTION_STAFF);
    }

    @JsonInclude
    public String getShownImageUrl () {
        if (this.product != null && this.product.getImageURL() != null && !this.product.getImageURL().isEmpty() && this.status.equals(OrderStatus.ORDER_COMPLETED))
            return this.product.getImageURL();
        else if (this.proofUrl != null && !this.proofUrl.isEmpty())
            return this.proofUrl;
        else if (this.design != null && this.design.getDesignLink() != null && !this.design.getDesignLink().isEmpty())
            return this.design.getDesignLink();
        else
            return null;
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
    //</editor-fold>
}