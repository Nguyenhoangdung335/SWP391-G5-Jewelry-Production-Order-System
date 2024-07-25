package com.swp391.JewelryProduction.services.quotation;

import com.swp391.JewelryProduction.dto.ResponseDTOs.QuotationItemResponse;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.repositories.QuotationRepository;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {
    private final QuotationRepository quotationRepository;
    private final OrderService orderService;
    private final GemstoneService gemstoneService;


    @Override
    public Quotation findQuotationByOrderId(String orderId) {
        if(quotationRepository.findQuotationByOrderId(orderId).isPresent()) {
            return quotationRepository.findQuotationByOrderId(orderId).get();
        } else return null;
    }

    @Transactional
    @Override
    public Quotation saveQuotation(Quotation quotation, Order order) {
        quotation.getQuotationItems().forEach(item -> {
            item.setQuotation(quotation);
        });
        order.setQuotation(quotation);
        quotation.setOrder(order);
        order = orderService.updateOrder(order);
        return order.getQuotation();
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

    @Override
    public List<QuotationItemResponse> getDefaultQuotationItems(Order order) {
        Gemstone gemstone = order.getProduct().getSpecification().getGemstone();
        Metal metal = order.getProduct().getSpecification().getMetal();
//        Map<String, Double> appliedMultiplier = gemstoneService.getAppliedMultiplier(gemstone);
//        double price = gemstoneService.calculatePrice(gemstone);
//        double rawGemstonePrice = gemstone.getGemstonePriceByCaratWeight();

        int index = 0;
        List<QuotationItemResponse> items = new LinkedList<>();
        items.add(QuotationItemResponse.builder().itemID(index++).name("Support cost").quantity(1).unitPrice(100.0).totalPrice(100.0).build());
        items.add(QuotationItemResponse.builder().itemID(index++).name("Design cost").quantity(1).unitPrice(100.0).totalPrice(100.0).build());
        items.add(QuotationItemResponse.builder().itemID(index++).name("Production cost").quantity(1).unitPrice(200.0).totalPrice(200.0).build());
        items.add(QuotationItemResponse.builder().itemID(index++).name("Metal ("+metal.getName()+")").quantity(1).unitPrice(metal.getPrice()).totalPrice(metal.getPrice()).build());
//        items.add(QuotationItemResponse.builder().itemID(index++).name("Gemstone ("+gemstone.getType().getName()+")").quantity(gemstone.getCaratWeight()).unitPrice(gemstone.getType().getBasePricePerCarat()).totalPrice(gemstoneService.calculatePrice(gemstone)).build());

        return items;
    }
}
