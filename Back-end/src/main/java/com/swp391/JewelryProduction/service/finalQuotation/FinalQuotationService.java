package com.swp391.JewleryProduction.services.finalQuotation;

import com.swp391.JewleryProduction.dto.FinalQuotationDTO;
import com.swp391.JewleryProduction.pojos.FinalQuotation;
import com.swp391.JewleryProduction.repositories.FinalQuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinalQuotationService implements IFinalQuotationService{
    FinalQuotationRepository finalQuotationRepository;

    @Autowired
    public FinalQuotationService(FinalQuotationRepository finalQuotationRepository) {
        this.finalQuotationRepository = finalQuotationRepository;
    }

    @Override
    public List<FinalQuotationDTO> findAllFinalQuotations() {
        return finalQuotationRepository.findAll().stream().map(finalQuotation -> mapToFinalQuotationDTO(finalQuotation)).collect(Collectors.toList());
    }

    private FinalQuotationDTO mapToFinalQuotationDTO(FinalQuotation finalQuotation) {
        return FinalQuotationDTO.builder()
                .quotationItems(finalQuotation.getQuotationItems())
                .id(finalQuotation.getId())
                .title(finalQuotation.getTitle())
                .expiredDate(finalQuotation.getExpiredDate())
                .createdDate(finalQuotation.getCreatedDate())
                .build();
    }
}
