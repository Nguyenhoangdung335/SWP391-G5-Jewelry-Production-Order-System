package com.swp391.JewelryProduction.pojos;

import com.swp391.JewelryProduction.enums.ReportType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = true)
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order reportingOrder;

    @OneToMany(mappedBy = "report", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Notification> notifications;

    public List<Notification> getNotifications () {
        if (notifications == null) notifications = new ArrayList<>();
        return notifications;
    }
}
