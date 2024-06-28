package com.swp391.JewelryProduction.pojos;

import com.swp391.JewelryProduction.enums.WorkStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.LinkedList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("1")
public class Staff extends Account{
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private WorkStatus workStatus = WorkStatus.FREE;

    @OneToMany(
            mappedBy = "staff",
            cascade = {CascadeType.MERGE, CascadeType.DETACH, CascadeType.REMOVE},
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    @Builder.Default
    private List<StaffOrderHistory> history = new LinkedList<>();
}
