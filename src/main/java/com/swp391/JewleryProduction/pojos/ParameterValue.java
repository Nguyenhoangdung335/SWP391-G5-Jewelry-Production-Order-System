package com.swp391.JewleryProduction.pojos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Parameter_Value")
public class ParameterValue {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(columnDefinition = "nvarchar(50)")
    private String value;
    @Column(columnDefinition = "text")
    private String description;

    @ManyToOne
    @JoinColumn(name = "parameter_id")
    private ProductParameters parameter;

    @OneToOne
    @JoinColumn(name = "detail_id")
    private ValueDetails details;

    @ManyToOne
    @JoinColumn(name = "specification_id")
    private ProductSpecification specification;
}
