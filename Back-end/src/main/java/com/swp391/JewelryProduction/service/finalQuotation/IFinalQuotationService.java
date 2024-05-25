package com.swp391.JewleryProduction.services.finalQuotation;

import com.swp391.JewleryProduction.dto.FinalQuotationDTO;

import java.util.List;

public interface IFinalQuotationService {
    List<FinalQuotationDTO> findAllFinalQuotations();
}
