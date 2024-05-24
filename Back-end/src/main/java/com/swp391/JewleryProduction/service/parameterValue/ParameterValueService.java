package com.swp391.JewleryProduction.services.parameterValue;

import com.swp391.JewleryProduction.dto.ParameterValueDTO;
import com.swp391.JewleryProduction.pojos.ParameterValue;
import com.swp391.JewleryProduction.repositories.ParameterValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParameterValueService implements IParameterValueService{
    private ParameterValueRepository parameterValueRepository;

    @Autowired
    public ParameterValueService(ParameterValueRepository parameterValueRepository) {
        this.parameterValueRepository = parameterValueRepository;
    }

    @Override
    public List<ParameterValueDTO> findAllParameterValues() {
        return parameterValueRepository.findAll().stream().map(parameterValue -> mapToParameterValueDTO(parameterValue)).collect(Collectors.toList());
    }

    private ParameterValueDTO mapToParameterValueDTO(ParameterValue parameterValue) {
        return ParameterValueDTO.builder()
                .value(parameterValue.getValue())
                .parameter(parameterValue.getParameter())
                .id(parameterValue.getId())
                .description(parameterValue.getDescription())
                .details(parameterValue.getDetails())
                .specification(parameterValue.getSpecification())
                .build();
    }
}
