package com.swp391.JewelryProduction.util;

public class CustomFormatter {
    public static Double roundToDecimal (Double input, int decimalPlace) {
        String format = "%."+decimalPlace+"f";
        return Double.parseDouble(String.format(format, input));
    }
}
