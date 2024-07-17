package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.pojos.gemstone.Gemstone;

import java.util.List;
import java.util.Map;

public interface GemstoneService {
    Map<String, Object> getGemstoneFactor();

    double calculatePrice(Gemstone gemstone);

    List<Gemstone> getGemstones();
    Gemstone getGemstone(long id);
    Gemstone createGemstone(Gemstone gemstone);
    Gemstone updateGemstone(Gemstone gemstone);
    boolean deleteGemstone(long id);
}
