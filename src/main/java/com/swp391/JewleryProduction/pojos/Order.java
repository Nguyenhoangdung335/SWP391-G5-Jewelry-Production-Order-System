package com.swp391.JewleryProduction.pojos;

import com.swp391.JewleryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "[Order]")
public class Order {
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
    @Column(columnDefinition = "nvarchar(8)")
    private String id;
    private String name;
    private double budget;
    private LocalDateTime createdDate;

    @OneToOne
    @JoinColumn(name = "quotation_id")
    private FinalQuotation quotation;

    @OneToOne
    @JoinColumn(name = "design_id")
    private Design design;
}
