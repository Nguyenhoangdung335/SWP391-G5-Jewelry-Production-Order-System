package com.swp391.JewleryProduction.services.parameterValue;

import com.swp391.JewleryProduction.dto.ParameterValueDTO;

import java.util.List;

public interface IParameterValueService {
    List<ParameterValueDTO> findAllParameterValues();
}
