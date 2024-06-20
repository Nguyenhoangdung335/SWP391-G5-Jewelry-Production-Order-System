package com.swp391.JewelryProduction.pojos;

import com.swp391.JewelryProduction.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "User_Info")
@ToString(exclude = {"account"})
@EqualsAndHashCode(exclude = {"account"})
public class UserInfo {
    @Id
    private String id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "phone_number", length = 10)
    private String phoneNumber;

    private String address;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;
}
