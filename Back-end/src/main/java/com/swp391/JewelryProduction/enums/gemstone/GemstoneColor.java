package com.swp391.JewelryProduction.enums.gemstone;

import lombok.Getter;

@Getter
public enum GemstoneColor {
    N(1, "Faint"),
    M(1, "Faint"),
    L(2, "Faint"),
    K(2, "Faint"),
    J(3, "Near Colorless"),
    I(3, "Near Colorless"),
    H(4, "Near Colorless"),
    G(4, "Near Colorless"),
    F(5, "Colorless"),
    E(5, "Colorless"),
    D(5, "Colorless");

    private final int complexity;
    private final String name;

    GemstoneColor (int complexity, String name) {
        this.complexity = complexity;
        this.name = name;
    }
}
