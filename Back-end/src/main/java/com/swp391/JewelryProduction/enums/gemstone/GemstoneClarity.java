package com.swp391.JewelryProduction.enums.gemstone;

import lombok.Getter;

@Getter
public enum GemstoneClarity {
    IF_VVS(9, "Internally Flawless, Very Very Slightly Included"),
    VS1(8, "Very Slightly Included 1"),
    VS2(7, "Very Slightly Included 2"),
    SI1(6, "Slightly Included 1"),
    SI2(5, "Slightly Included 2"),
    S3(4, "Slightly Included 3"),
    I1(3, "Included 1"),
    I2(2, "Included 2"),
    I3(1, "Included 3");

    private final int complexity;
    private final String name;

    GemstoneClarity (int complexity, String name) {
        this.complexity = complexity;
        this.name = name;
    }
}
