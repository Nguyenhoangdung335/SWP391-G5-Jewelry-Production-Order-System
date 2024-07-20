package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.pojos.gemstone.*;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.repositories.gemstoneRepositories.*;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
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

    private final ProductSpecificationRepository productSpecificationRepository;

    @Override
    public Map<String, Object> getGemstoneFactor () {
        Map<String, Object> response = new HashMap<>();
        response.put("type", gemstoneTypeRepository.findAllByStatusTrue());
        response.put("shape", shapeMultiplierRepository.findAll());
        response.put("cut", cutMultiplierRepository.findAll());
        response.put("clarity", clarityMultiplierRepository.findAll());
        response.put("color", colorMultiplierRepository.findAll());
        return response;
    }

    @Override
    public double calculatePrice(Gemstone gemstone) {
        double basePrice = getBasePricePerCarat(gemstone.getType().getId());
        double weightMultiplier = getWeightMultiplier(gemstone.getCaratWeight());
        double shapeMultiplier = getShapeMultiplier(gemstone.getShape());
        double cutMultiplier = getCutMultiplier(gemstone.getCut());
        double clarityMultiplier = getClarityMultiplier(gemstone.getClarity());
        double colorMultiplier = getColorMultiplier(gemstone.getColor());

        return basePrice * gemstone.getCaratWeight() * weightMultiplier * shapeMultiplier * cutMultiplier * clarityMultiplier * colorMultiplier;
    }

    @Override
    public Map<String, Double> getAppliedMultiplier(Gemstone gemstone) {
        Map<String, Double> appliedMultiplier = new HashMap<>();

        appliedMultiplier.put(String.format("Shape (%s)", gemstone.getShape()), getShapeMultiplier(gemstone.getShape()));
        appliedMultiplier.put(String.format("Cut (%s)", gemstone.getCut()), getCutMultiplier(gemstone.getCut()));
        appliedMultiplier.put(String.format("Clarity (%s)", gemstone.getClarity()), getClarityMultiplier(gemstone.getClarity()));
        appliedMultiplier.put(String.format("Color (%s)", gemstone.getColor()), getColorMultiplier(gemstone.getColor()));

        return appliedMultiplier;
    }

    @Override
    public List<GemstoneType> getGemstoneType() {
        return gemstoneTypeRepository.findAllByStatusTrue();
    }

    @Override
    public List<ShapeMultiplier> getShapeMultipliers() {
        return shapeMultiplierRepository.findAll().stream().toList();
    }

    @Override
    public List<CutMultiplier> getCutMultipliers() {
        return cutMultiplierRepository.findAll().stream().toList();
    }

    @Override
    public List<ColorMultiplier> getColorMultipliers() {
        return colorMultiplierRepository.findAll().stream().toList();
    }

    @Override
    public List<ClarityMultiplier> getClarityMultipliers() {
        return clarityMultiplierRepository.findAll().stream().toList();
    }

    @Override
    public Gemstone getGemstone(long id) {
        return gemstoneRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException(("Gemstone with id " + id + " not found")));
    }

    @Override
    public Gemstone createGemstone(Gemstone gemstone) {
        GemstoneType gemstoneType = gemstoneTypeRepository.findByName(gemstone.getType().getName())
                .orElse(GemstoneType.builder()
                        .name(gemstone.getType().getName())
                        .build());
        gemstoneType.setBasePricePerCarat(gemstone.getType().getBasePricePerCarat());
        gemstone.setType(gemstoneType);
        return gemstoneRepository.save(gemstone);
    }

    @Override
    public Gemstone updateGemstone(Gemstone gemstone) {
        gemstoneRepository.findById(gemstone.getId())
                .orElseThrow(() -> new ObjectNotFoundException("Gemstone with id " + gemstone.getId() + " not found"));
        GemstoneType gemstoneType = gemstoneTypeRepository.findByName(gemstone.getType().getName())
                .orElse(GemstoneType.builder()
                        .name(gemstone.getType().getName())
                        .build());
        gemstoneType.setBasePricePerCarat(gemstone.getType().getBasePricePerCarat());
        gemstone.setType(gemstoneType);
        return gemstoneRepository.save(gemstone);
    }

    @Transactional
    @Override
    public void deleteGemstone(long id) {
        GemstoneType gemstoneType = gemstoneTypeRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException(("Gemstone with id " + id + " not found")));
        gemstoneType.setStatus(false);
        gemstoneTypeRepository.save(gemstoneType);
    }

    @Override
    public GemstoneType editGemstoneType(GemstoneType gemstoneType) {
        GemstoneType type = gemstoneTypeRepository.findByName(gemstoneType.getName())
                .orElse(GemstoneType.builder()
                        .name(gemstoneType.getName())
                        .status(true)
                        .build());
        type.setBasePricePerCarat(gemstoneType.getBasePricePerCarat());
        return gemstoneTypeRepository.save(type);
    }

    @Override
    public CutMultiplier updateCutMultiplier(long id, double multiplier) {
        CutMultiplier cutMultiplier = cutMultiplierRepository
                .findById(id).orElseThrow(() -> new ObjectNotFoundException("CutMultiplier with id " + id + " not found"));
        cutMultiplier.setMultiplier(multiplier);
        return cutMultiplierRepository.save(cutMultiplier);
    }

    @Override
    public ColorMultiplier updateColorMultiplier(long id, double multiplier) {
        ColorMultiplier colorMultiplier = colorMultiplierRepository
                .findById(id).orElseThrow(() -> new ObjectNotFoundException("ColorMultiplier with id " + id + " not found"));
        colorMultiplier.setMultiplier(multiplier);
        return colorMultiplierRepository.save(colorMultiplier);
    }

    @Override
    public ClarityMultiplier updateClarityMultiplier(long id, double multiplier) {
        ClarityMultiplier clarityMultiplier = clarityMultiplierRepository
                .findById(id).orElseThrow(() -> new ObjectNotFoundException("ClarityMultiplier with id " + id + " not found"));
        clarityMultiplier.setMultiplier(multiplier);
        return clarityMultiplierRepository.save(clarityMultiplier);
    }

    @Override
    public ShapeMultiplier updateShapeMultiplier(long id, double multiplier) {
        ShapeMultiplier shapeMultiplier = shapeMultiplierRepository
                .findById(id).orElseThrow(() -> new ObjectNotFoundException("ShapeMultiplier with id " + id + " not found"));
        shapeMultiplier.setMultiplier(multiplier);
        return shapeMultiplierRepository.save(shapeMultiplier);
    }

    //<editor-fold desc="PRIVATE METHODS" defaultstate="collapsed">
    private double getBasePricePerCarat(Long gemstoneId) {
        GemstoneType type = gemstoneTypeRepository.findById(gemstoneId).orElse(null);
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
