package com.swp391.JewleryProduction.services.quotationItem;

import com.swp391.JewleryProduction.dto.QuotationItemDTO;
import com.swp391.JewleryProduction.pojos.QuotationItem;
import com.swp391.JewleryProduction.repositories.QuotationItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuotationItemService implements IQuotationItemService{
    private QuotationItemRepository quotationItemRepository;

    @Autowired
    public QuotationItemService(QuotationItemRepository quotationItemRepository) {
        this.quotationItemRepository = quotationItemRepository;
    }

    @Override
    public List<QuotationItemDTO> findAllQuotationItems() {
        return quotationItemRepository.findAll().stream().map(quotationItem -> mapToQuotationItemDTO(quotationItem)).collect(Collectors.toList());
    }

    private QuotationItemDTO mapToQuotationItemDTO(QuotationItem quotationItem) {
        return QuotationItemDTO.builder()
                .quotation(quotationItem.getQuotation())
                .id(quotationItem.getId())
                .name(quotationItem.getName())
                .quantity(quotationItem.getQuantity())
                .totalPrice(quotationItem.getTotalPrice())
                .unitPrice(quotationItem.getUnitPrice())
                .build();
    }
}
