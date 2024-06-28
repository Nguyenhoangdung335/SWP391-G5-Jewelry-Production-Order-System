package com.swp391.JewelryProduction.services.quotation;

import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.repositories.QuotationRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {
    private final QuotationRepository quotationRepository;


    @Override
    public Quotation findQuotationByOrderId(String orderId) {
        if(quotationRepository.findQuotationByOrderId(orderId).isPresent()) {
            return quotationRepository.findQuotationByOrderId(orderId).get();
        } else return null;
    }

    @Transactional
    @Override
    public Quotation saveQuotation(Quotation quotation) {
        return quotationRepository.save(quotation);
    }

    @Override
    public Quotation findById(String id) {
        return quotationRepository
                .findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Quotation of id "+id+" cannot be found"));
    }

    @Override
    public void deleteQuotation(Quotation quotation) {
        quotationRepository.delete(quotation);
    }

    @Override
    public void deleteQuotationByID(String quotationID) {
        quotationRepository.deleteById(quotationID);
    }

    @Override
    public List<Quotation> findAllQuotations() {
        return quotationRepository.findAll().stream().toList();
    }
}
