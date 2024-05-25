package com.swp391.JewleryProduction.services.valueDetails;

import com.swp391.JewleryProduction.dto.ValueDetailsDTO;

import java.util.List;

public interface IValueDetailsService {
    List<ValueDetailsDTO> findAllValueDetails();
}
