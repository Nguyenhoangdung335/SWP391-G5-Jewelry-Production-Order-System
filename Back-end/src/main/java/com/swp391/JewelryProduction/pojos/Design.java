package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Design {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "design_seq")
    @GenericGenerator(
            name = "design_seq",
            type = IdGenerator.class,
            parameters = {
                    @Parameter(name = IdGenerator.INCREMENT_PARAM, value = "1"),
                    @Parameter(name = IdGenerator.VALUE_PREFIX_PARAMETER, value = "DES"),
                    @Parameter(name = IdGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d")
            }
    )
    @Column(length = 8, nullable = false, updatable = false, unique = true)
    @ToString.Include
    @EqualsAndHashCode.Include
    private String id;
    @Column(name = "last_updated")
    @ToString.Include
    @EqualsAndHashCode.Include
    private LocalDateTime lastUpdated;
    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "design_link")
    private String designLink;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "design")
    @JsonBackReference("Order-Design")
    private Order order;
}
