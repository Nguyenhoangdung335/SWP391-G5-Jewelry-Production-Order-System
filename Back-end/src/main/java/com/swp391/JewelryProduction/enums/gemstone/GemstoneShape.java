package com.swp391.JewelryProduction.enums.gemstone;

import lombok.Getter;

@Getter
public enum GemstoneShape {
    ASSCHER(10),
    BAGUETTE(5),
    BRIOLETTE(18),
    CALF(7),
    CUSHION(6),
    EMERALD(9),
    HALF_MOON(12),
    HEART(14),
    MARQUISE(13),
    OCTAGONAL(8),
    OVAL(11),
    PEAR(15),
    PRINCESS(4),
    RADIANT(3),
    ROUND(2),
    SQUARE_CUSHION(6),
    SQUARE_RADIANT(3),
    TRILLION(16);

    private final int complexity;

    GemstoneShape(int complexity) {
        this.complexity = complexity;
    }
}
