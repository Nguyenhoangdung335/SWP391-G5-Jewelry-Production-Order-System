package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.dto.RequestDTOs.GemstoneRequest;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.repositories.GemstoneRepository;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GemstoneServiceImpl implements GemstoneService{

    private final GemstoneRepository gemstoneRepository;
    private final ProductSpecificationRepository productSpecificationRepository;

    @Override
    public Gemstone findById(Long id) {
        return gemstoneRepository.findById(id).orElseThrow(
                () -> new ObjectNotFoundException("Gemstone with id "+id+" does not exist")
        );
    }

    @Override
    public Page<Gemstone> findAll(int page, int pageSize) {
        return findAll(page, pageSize, "caratWeightFrom");
    }

    @Override
    public Page<Gemstone> findAll(int page, int pageSize, String sortBy) {
        return gemstoneRepository.findAll(PageRequest.of(page, pageSize, Sort.by(sortBy).ascending()));
    }

    @Override
    public List<Gemstone> searchByProperties(GemstoneRequest gemstoneRequest) {
        return gemstoneRepository.findGemstonesByRequest(
                gemstoneRequest.getName(),
                gemstoneRequest.getShape(),
                gemstoneRequest.getClarity(),
                gemstoneRequest.getColor(),
                gemstoneRequest.getCut(),
                gemstoneRequest.getWeight()
        );
    }

    @Override
    public Map<String, Object> getGemstoneFactor () {
        Map<String, Object> response = new HashMap<>();
        response.put("names", gemstoneRepository.getAllDistinctGemstoneName());
        response.put("shapes", gemstoneRepository.getAllDistinctGemstoneShape());
        response.put("cuts", gemstoneRepository.getAllDistinctGemstoneCut());
        response.put("clarities", gemstoneRepository.getAllDistinctGemstoneClarity());
        response.put("colors", gemstoneRepository.getAllDistinctGemstoneColor());
        response.put("minWeight", gemstoneRepository.findLowestCaratWeightFrom());
        response.put("maxWeight", gemstoneRepository.findHighestCaratWeightTo());
        return response;
    }

    @Transactional
    @Override
    public void deleteGemstone(long id) {
        Gemstone gemstone = gemstoneRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException(("Gemstone with id " + id + " not found")));
        gemstone.setActive(false);
        gemstoneRepository.save(gemstone);
    }

    @Override
    public Gemstone createGemstone(Gemstone gemstone) {
        return gemstoneRepository.save(gemstone);
    }

    @Override
    public Gemstone updateGemstone(Gemstone gemstone) {
        Gemstone searchGemstone = gemstoneRepository.findById(gemstone.getId()).orElseThrow(
                () -> new ObjectNotFoundException("Gemstone with Id "+gemstone.getId()+" not found")
        );
        searchGemstone = searchGemstone.copyGemstone(gemstone);
        return gemstoneRepository.save(searchGemstone);
    }
}
