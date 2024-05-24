package com.swp391.JewleryProduction.services.quotationItem;

import com.swp391.JewleryProduction.dto.QuotationItemDTO;
import com.swp391.JewleryProduction.pojos.QuotationItem;

import java.util.List;

public interface IQuotationItemService {
    List<QuotationItemDTO> findAllQuotationItems();
}
