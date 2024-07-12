package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.*;
import com.swp391.JewelryProduction.enums.ReportType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Report {
    @ToString.Include
    @EqualsAndHashCode.Exclude
    @Id
    @GeneratedValue
    private Integer id;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String title;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(length = 2048)
    private String description;

    @ToString.Include
    @EqualsAndHashCode.Include
    private LocalDateTime createdDate;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private ReportType type;

    @JsonIgnore
    @ToString.Include
    @EqualsAndHashCode.Include
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = true)
    private Account sender;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonBackReference("Order-Report")
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order reportingOrder;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "report", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @Builder.Default
    private List<Notification> notifications = new LinkedList<>();

    public List<Notification> getNotifications () {
        if (notifications == null) notifications = new ArrayList<>();
        return notifications;
    }
}
