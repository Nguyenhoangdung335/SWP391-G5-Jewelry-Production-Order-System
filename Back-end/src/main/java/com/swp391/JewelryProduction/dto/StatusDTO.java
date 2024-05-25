package com.swp391.JewleryProduction.dto;

import com.swp391.JewleryProduction.enums.StatusType;
import com.swp391.JewleryProduction.pojos.Account;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StatusDTO {
    private Integer id;
    private String statusName;
    private StatusType type;
    private List<Account> accountList;
}
