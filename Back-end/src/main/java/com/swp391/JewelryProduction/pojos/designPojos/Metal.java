package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.jetbrains.annotations.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "Metal")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Metal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 20)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 20)
    private String unit;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5000000.0")
    @Column(nullable = false)
    private Double marketPrice;

    @DecimalMin("0.0")
    @DecimalMax("5000000.0")
    private Double companyPrice;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy")
    @DateTimeFormat(pattern = "HH:mm dd-MM-yyyy")
    @UpdateTimestamp
    private LocalDateTime updatedTime;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "metal", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ProductSpecification> specifications;

    @Override
    public String toString() {
        return "Component {" +
                "name='" + name + '\'' +
                ", marketPrice='" + marketPrice + '\'' +
                ", companyPrice='" + companyPrice + '\'' +
                ", crawlTime='" + updatedTime + '\'' +
                '}';
    }

    public Metal copyValue (Metal copy) {
        this.name = copy.getName();
        this.unit = copy.getUnit();
        this.marketPrice = copy.getMarketPrice();
        this.companyPrice = copy.getCompanyPrice();
        this.updatedTime = copy.getUpdatedTime();
        this.specifications = copy.getSpecifications();
        return this;
    }
}
