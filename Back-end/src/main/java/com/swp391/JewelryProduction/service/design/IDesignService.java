package com.swp391.JewleryProduction.services.design;

import com.swp391.JewleryProduction.dto.DesignDTO;

import java.util.List;

public interface IDesignService {
    List<DesignDTO> findAllDesigns();
}
