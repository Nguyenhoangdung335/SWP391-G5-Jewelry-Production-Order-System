package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.enums.Gender;
import com.swp391.JewleryProduction.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class UserDTO {
    private String id;
    private String email;
    private LocalDateTime dateCreated;
    private Role role;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private Gender gender;
    private long phoneNumber;
    private String address;
}
