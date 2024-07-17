package com.swp391.JewelryProduction.pojos.Price;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "Metal_Price")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MetalPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy")
    @DateTimeFormat(pattern = "HH:mm dd-MM-yyyy")
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
                ", price='" + price + '\'' +
                ", crawlTime='" + updatedTime + '\'' +
                '}';
    }
}
