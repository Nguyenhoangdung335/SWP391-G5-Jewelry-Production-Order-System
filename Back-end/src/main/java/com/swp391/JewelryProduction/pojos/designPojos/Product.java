package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.*;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(generator = "product_seq")
    @GenericGenerator(
            name = "product_seq",
            type = IdGenerator.class,
            parameters = {
                    @Parameter(name = IdGenerator.INCREMENT_PARAM, value = "1"),
                    @Parameter(name = IdGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d"),
                    @Parameter(name = IdGenerator.VALUE_PREFIX_PARAMETER, value = "PRO")
            }
    )
    @Column(length = 8, nullable = false, updatable = false, unique = true)
    private String id;
    private String name;
    private String description;
    @Column(length = 1024)
    private String imageURL;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private ProductSpecification specification;

    @ToString.Exclude
    @OneToOne(mappedBy = "product", fetch = FetchType.EAGER)
    @JsonBackReference("Order-Product")
    private Order order;
}
