package com.swp391.JewelryProduction.pojos;

import com.swp391.JewelryProduction.enums.StatusType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Status {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(nullable = false, name = "status_name")
    private String statusName;
    @Enumerated(EnumType.STRING)
    private StatusType type;

    @OneToMany(mappedBy = "status")
    private List<Account> accountList;
}
