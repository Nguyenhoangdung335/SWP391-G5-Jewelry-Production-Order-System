package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.pojos.gemstone.Gemstone;

import java.util.Map;

public interface GemstoneService {
    Map<String, Object> getGemstoneFactor();

    double calculatePrice(Gemstone gemstone);
}
