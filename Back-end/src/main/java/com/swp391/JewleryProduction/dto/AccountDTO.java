package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.enums.Gender;
import com.swp391.JewleryProduction.enums.Role;
import com.swp391.JewleryProduction.pojos.Status;
import com.swp391.JewleryProduction.util.IdGenerator;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AccountDTO {
    private String id;
    private String email;
    private String password;
    private LocalDateTime dateCreated;
    private Role role;
    private Status status;
}
