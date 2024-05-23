package com.swp391.JewleryProduction.pojos;

import com.swp391.JewleryProduction.enums.ReportType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue
    private Integer id;
    private String title;
    private String description;
    private LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    private ReportType type;

    @OneToOne(cascade = CascadeType.ALL)
    private Account sender;


}
