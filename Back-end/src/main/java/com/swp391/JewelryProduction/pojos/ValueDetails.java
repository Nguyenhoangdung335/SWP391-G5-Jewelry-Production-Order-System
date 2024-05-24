package com.swp391.JewelryProduction.pojos;

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
public class ValueDetails {
    @Id
    @GeneratedValue
    @Column(name = "style_id")
    private Integer styleID;
    @Column(name = "parameter_name")
    private String parameterName;
    @Column(name = "parameter_value")
    private String parameterValue;
}
