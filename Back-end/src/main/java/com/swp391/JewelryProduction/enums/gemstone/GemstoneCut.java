package com.swp391.JewelryProduction.enums.gemstone;

import lombok.Getter;

@Getter
public enum GemstoneCut {
    FAIR(1),
    GOOD(2),
    VERY_GOOD(3),
    EXCELLENT(4);

    private final int complexity;

    GemstoneCut (int complexity) {
        this.complexity = complexity;
    }
}
