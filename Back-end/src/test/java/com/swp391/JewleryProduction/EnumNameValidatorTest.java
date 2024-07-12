package com.swp391.JewleryProduction;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.enums.ReportType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

public class EnumNameValidatorTest {
    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidEnumName() {
        ReportRequest request = ReportRequest.builder()
                .title("Test Title")
                .description("Test Description")
                .type(ReportType.REQUEST)
                .reportContentID("12345")
                .build();

        Set<ConstraintViolation<ReportRequest>> violations = validator.validate(request);
        System.out.println(violations);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidEnumName() {
        ReportRequest request = ReportRequest.builder()
                .title("Test Title")
                .description("Test Description")
                .type(ReportType.NONE)  // Assuming INVALID is not a valid type
                .reportContentID("12345")
                .build();

        Set<ConstraintViolation<ReportRequest>> violations = validator.validate(request);
        System.out.println(violations);
        assertFalse(violations.isEmpty());
    }
}