package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.pojos.gemstone.*;

import java.util.List;
import java.util.Map;

public interface GemstoneService {
    Map<String, Object> getGemstoneFactor();

    double calculatePrice(Gemstone gemstone);

    Map<String, Double> getAppliedMultiplier(Gemstone gemstone);

    List<GemstoneType> getGemstoneType();
    List<ShapeMultiplier> getShapeMultipliers();
    List<CutMultiplier> getCutMultipliers();
    List<ColorMultiplier> getColorMultipliers();
    List<ClarityMultiplier> getClarityMultipliers();

    Gemstone getGemstone(long id);
    Gemstone createGemstone(Gemstone gemstone);
    Gemstone updateGemstone(Gemstone gemstone);
    void deleteGemstone(long id);

    GemstoneType editGemstoneType(GemstoneType gemstoneType);


    CutMultiplier updateCutMultiplier(long id, double multiplier);
    ColorMultiplier updateColorMultiplier(long id, double multiplier);
    ClarityMultiplier updateClarityMultiplier(long id, double multiplier);
    ShapeMultiplier updateShapeMultiplier(long id, double multiplier);
}
