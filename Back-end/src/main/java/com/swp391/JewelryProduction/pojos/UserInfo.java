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
public class UserInfo {
    @ToString.Include
    @EqualsAndHashCode.Include
    @Id
    private String id;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "first_name")
    private String firstName;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "last_name")
    private String lastName;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ToString.Include
    @EqualsAndHashCode.Include
    @Column(name = "phone_number")
    private String phoneNumber;

    @ToString.Include
    @EqualsAndHashCode.Include
    private String address;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;
}
