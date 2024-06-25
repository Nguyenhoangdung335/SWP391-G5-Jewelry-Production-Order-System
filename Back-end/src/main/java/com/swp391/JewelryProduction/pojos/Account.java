package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "is_staff", columnDefinition = "bit")
@DiscriminatorValue("0")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Account{
    @ToString.Include
    @EqualsAndHashCode.Include
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

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(nullable = false, unique = true)
    private String email;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(nullable = false)
    private String password;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private Role role;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @ToString.Include
    @EqualsAndHashCode.Include
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @PrimaryKeyJoinColumn
    private UserInfo userInfo;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner", cascade = CascadeType.REMOVE)
    @Builder.Default
    private List<Order> pastOrder = new LinkedList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Report> sendingReports = new LinkedList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<Notification> notifications = new LinkedList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
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

    public void setUserInfo (UserInfo userInfo) {
        this.userInfo = userInfo;
        userInfo.setAccount(this);
    }
}
