package com.swp391.JewelryProduction.services.design;

import com.swp391.JewelryProduction.dto.DesignDTO;
import com.swp391.JewelryProduction.pojos.Design;

import java.util.List;

public interface DesignService {
    List<Design> findAll();
    Design findById (String id);
    Design update (Design design);
    void deleteById (String id);
    Design save(Design design);
}
