package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.gemstone.*;
import com.swp391.JewelryProduction.repositories.gemstoneRepositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GemstoneServiceImpl implements GemstoneService{
    private final GemstoneTypeRepository gemstoneTypeRepository;
    private final ShapeMultiplierRepository shapeMultiplierRepository;
    private final CutMultiplierRepository cutMultiplierRepository;
    private final ClarityMultiplierRepository clarityMultiplierRepository;
    private final ColorMultiplierRepository colorMultiplierRepository;
    private final GemstoneRepository gemstoneRepository;

    @Override
    public Map<String, Object> getGemstoneFactor () {
        Map<String, Object> response = new HashMap<>();
        response.put("gemstoneType", gemstoneTypeRepository.findAll());
        response.put("shape", shapeMultiplierRepository.findAll());
        response.put("cut", cutMultiplierRepository.findAll());
        response.put("clarity", clarityMultiplierRepository.findAll());
        response.put("color", colorMultiplierRepository.findAll());
        return response;
    }

    @Override
    public double calculatePrice(Gemstone gemstone) {
        double basePrice = getBasePricePerCarat(gemstone.getType().getName());
        double weightMultiplier = getWeightMultiplier(gemstone.getCaratWeight());
        double shapeMultiplier = getShapeMultiplier(gemstone.getShape());
        double cutMultiplier = getCutMultiplier(gemstone.getCut());
        double clarityMultiplier = getClarityMultiplier(gemstone.getClarity());
        double colorMultiplier = getColorMultiplier(gemstone.getColor());

        return basePrice * gemstone.getCaratWeight() * weightMultiplier * shapeMultiplier * cutMultiplier * clarityMultiplier * colorMultiplier;
    }

    //<editor-fold desc="PRIVATE METHODS" defaultstate="collapsed">
    private double getBasePricePerCarat(String gemstoneType) {
        GemstoneType type = gemstoneTypeRepository.findByName(gemstoneType).orElse(null);
        return type != null ? type.getBasePricePerCarat() : 0;
    }

    private double getWeightMultiplier(double caratWeight) {
        if (caratWeight <= 0.5) {
            return 1.0;
        } else if (caratWeight <= 1.0) {
            return 1.1;
        } else if (caratWeight <= 2.0) {
            return 1.2;
        } else {
            return 1.3;
        }
    }

    private double getShapeMultiplier(GemstoneShape shape) {
        ShapeMultiplier multiplier = shapeMultiplierRepository.findByShape(shape).orElse(null);
        return multiplier != null ? multiplier.getMultiplier() : 1.0;
    }

    private double getCutMultiplier (GemstoneCut cut) {
        CutMultiplier cutMultiplier = cutMultiplierRepository.findByCutQuality(cut).orElse(null);
        return cutMultiplier != null ? cutMultiplier.getMultiplier() : 1.0;
    }

    private double getClarityMultiplier (GemstoneClarity clarity) {
        ClarityMultiplier clarityMultiplier = clarityMultiplierRepository.findByClarity(clarity).orElse(null);
        return clarityMultiplier != null ? clarityMultiplier.getMultiplier() : 1.0;
    }

    private double getColorMultiplier (GemstoneColor color) {
        ColorMultiplier colorMultiplier = colorMultiplierRepository.findByColor(color).orElse(null);
        return colorMultiplier != null ? colorMultiplier.getMultiplier() : 1.0;
    }
    //</editor-fold>
}