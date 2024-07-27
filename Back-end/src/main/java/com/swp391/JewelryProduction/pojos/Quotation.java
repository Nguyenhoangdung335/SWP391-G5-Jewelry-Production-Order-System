package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.*;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import static com.swp391.JewelryProduction.util.CustomFormatter.roundToDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "final_quotation")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Quotation {
    @Id
    @GeneratedValue(generator = "quotation_seq")
    @GenericGenerator(
            name = "quotation_seq",
            type = IdGenerator.class,
            parameters = {
                    @Parameter(name = IdGenerator.INCREMENT_PARAM, value = "1"),
                    @Parameter(name = IdGenerator.VALUE_PREFIX_PARAMETER, value = "QUO"),
                    @Parameter(name = IdGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d")
            }
    )
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(length = 8, nullable = false, unique = true)
    private String id;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String title;

    @ToString.Include
    @EqualsAndHashCode.Include
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @ToString.Include
    @EqualsAndHashCode.Include
    @JsonFormat(pattern="yyyy-MM-dd")
    @Column(name = "expired_date", nullable = false)
    private LocalDate expiredDate;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<QuotationItem> quotationItems = new LinkedList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "quotation", fetch = FetchType.LAZY)
    @JsonBackReference("Order-Quotation")
    private Order order;

    @ToString.Include
    @EqualsAndHashCode.Include
    @DecimalMin("0.0")
    private Double consultCost;
    @ToString.Include
    @EqualsAndHashCode.Include
    @DecimalMin("0.0")
    private Double designCost;
    @ToString.Include
    @EqualsAndHashCode.Include
    @DecimalMin("0.0")
    private Double manufactureCost;
    @ToString.Include
    @EqualsAndHashCode.Include
    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double markupRatio;

    public Quotation (Quotation copy) {
        this.title = copy.getTitle();
        this.createdDate = LocalDate.now();
        this.expiredDate = LocalDate.now().plus(Period.between(copy.getCreatedDate(), copy.getExpiredDate()));
        this.manufactureCost = copy.getManufactureCost();
        this.markupRatio = copy.getMarkupRatio();
        this.quotationItems = new LinkedList<>();
        copy.getQuotationItems().forEach(item -> {
            QuotationItem newItem = new QuotationItem(item);
            newItem.setQuotation(this);
            this.quotationItems.add(newItem);
        });
    }

    @JsonInclude
    public Double getTotalPrice () {
        double total = 0.0;
        for (var item: quotationItems) {
            total += item.getTotalPrice();
        }
        if (consultCost != null) total += consultCost;
        if (designCost != null) total += designCost;
        if (manufactureCost != null) total += manufactureCost;
        return total;
    }

    @JsonInclude
    public Double getFinalPrice () {
        double total = getTotalPrice();
        if (markupRatio != null) total += total * markupRatio;
        return total;
    }

    @JsonIgnore
    public Double getHalfPrice () {
        return roundToDecimal(getFinalPrice() / 2.0, 2);
    }
}
