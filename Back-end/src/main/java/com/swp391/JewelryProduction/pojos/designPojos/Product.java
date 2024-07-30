package com.swp391.JewelryProduction.pojos.designPojos;

import com.fasterxml.jackson.annotation.*;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.util.LinkedList;
import java.util.List;

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
    @ToString.Include
    @EqualsAndHashCode.Include
    private String id;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String name;
    @ToString.Include
    @EqualsAndHashCode.Include
    private String description;
    @Column(length = 2048)
    @ToString.Include
    @EqualsAndHashCode.Include
    private String imageURL;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private ProductSpecification specification;

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders = new LinkedList<>();
}
