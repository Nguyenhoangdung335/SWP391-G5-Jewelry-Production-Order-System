package com.swp391.JewelryProduction.pojos;

import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "is_staff", columnDefinition = "bit")
@DiscriminatorValue("0")
@ToString(exclude = {"userInfo", "pastOrder", "sendingReports", "notifications"})
@EqualsAndHashCode(exclude = {"userInfo", "pastOrder", "sendingReports", "notifications"})
public class Account{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_seq")
    @GenericGenerator(
            name = "account_seq",
            type = IdGenerator.class,
            parameters = {
                    @Parameter(name = IdGenerator.INCREMENT_PARAM, value = "1"),
                    @Parameter(name = IdGenerator.VALUE_PREFIX_PARAMETER, value = "ACC"),
                    @Parameter(name = IdGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d")
            }
    )
    @Column(length = 8, nullable = false, updatable = false, unique = true)
    private String id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JoinColumn(nullable = false)
    @PrimaryKeyJoinColumn
    private UserInfo userInfo;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "owner", cascade = CascadeType.REMOVE)
    private List<Order> pastOrder;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<Report> sendingReports;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @Transient
    private Order currentOrder;

    public void addSendingReport(Report report) {
        report.setSender(this);
        this.getSendingReports().add(report);
    }

    public Order getCurrentOrder() {
        if (pastOrder != null && !pastOrder.isEmpty())
            currentOrder = pastOrder.get(pastOrder.size() - 1);
        return currentOrder;
    }
}
