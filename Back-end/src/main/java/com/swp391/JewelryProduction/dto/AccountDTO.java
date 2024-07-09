package com.swp391.JewelryProduction.dto;

import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Notification;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Report;
import com.swp391.JewelryProduction.pojos.UserInfo;
import com.swp391.JewelryProduction.util.CustomValidator.EnumNameValidator;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDTO{
    private String id;
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Email is invalid")
    private String email;
    private String password;
    private LocalDateTime dateCreated;
    @EnumNameValidator(regexp = "CUSTOMER|SALE_STAFF|DESIGN_STAFF|PRODUCTION_STAFF|MANAGER|ADMIN", message = "Role is not valid")
    private Role role;
    @EnumNameValidator(regexp = "ACTIVE|INACTIVE|DELETED|LOCKED", message = "Status is not valid")
    private AccountStatus status;
    private UserInfo userInfo;
}
