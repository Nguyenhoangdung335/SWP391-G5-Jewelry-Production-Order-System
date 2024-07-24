package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffService staffService;

    @GetMapping("/get-all")
    public ResponseEntity<Response> getAvailableStaffLists () {
        return Response.builder()
                .message("Request sent successfully")
                .response("saleStaffs", staffService.findAllByRole(Role.SALE_STAFF))
                .response("designStaffs", staffService.findAllByRole(Role.DESIGN_STAFF))
                .response("productionStaffs", staffService.findAllByRole(Role.PRODUCTION_STAFF))
                .buildEntity();
    }
}
