package com.swp391.JewelryProduction.services.quotation;

import com.swp391.JewelryProduction.dto.FinalQuotationDTO;
import com.swp391.JewelryProduction.dto.ResponseDTOs.QuotationItemResponse;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.QuotationItem;

import java.util.List;
import java.util.Optional;

public interface QuotationService {
    Quotation findQuotationByOrderId(String orderId);
    Quotation saveQuotation(Quotation quotation, Order order);
    Quotation findById (String id);

    void deleteQuotation(Quotation quotation);
    void deleteQuotationByID (String quotationID);
    List<Quotation> findAllQuotations();

    Quotation getDefaultQuotation (Order order);
}
