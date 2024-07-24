package com.swp391.JewelryProduction.services.gemstone;

import com.swp391.JewelryProduction.dto.RequestDTOs.GemstoneRequest;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.pojos.designPojos.GemstoneType;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface GemstoneService {
    Gemstone findById (Long id);
    Page<Gemstone> findAll(int page, int pageSize);
    Page<Gemstone> findAll(int page, int pageSize, String sortBy);

    List<Gemstone> searchByProperties (GemstoneRequest gemstoneRequest);

    Map<String, Object> getGemstoneFactor();
    void deleteGemstone(long id);
    Gemstone createGemstone(Gemstone gemstone);
    Gemstone updateGemstone(Gemstone gemstone);
}
