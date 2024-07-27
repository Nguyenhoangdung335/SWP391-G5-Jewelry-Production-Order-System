package com.swp391.JewelryProduction.services.quotation;

import com.swp391.JewelryProduction.dto.ResponseDTOs.QuotationItemResponse;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.QuotationItem;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.repositories.QuotationRepository;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuotationServiceImpl implements QuotationService {
    private final QuotationRepository quotationRepository;
    private final OrderService orderService;
    private final GemstoneService gemstoneService;

    @Value("${price.default.based_cost}")
    private double basedLaborCost;
    @Value("${price.default.sale_multiplier}")
    private double saleMultiplier;
    @Value("${price.default.design_multiplier}")
    private double designMultiplier;
    @Value("${price.default.production_multiplier}")
    private double productionMultiplier;

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
    public Quotation getDefaultQuotation(Order order) {
        ProductSpecification specs = order.getProduct().getSpecification();
        Gemstone gemstone = order.getProduct().getSpecification().getGemstone();
        Metal metal = order.getProduct().getSpecification().getMetal();
        double complexityScale = gemstone.getComplexityCost();
        boolean isFromTemplate = order.isFromTemplate();

        Quotation quotation = Quotation.builder()
                .title("Quotation for order "+order.getId())
                .createdDate(LocalDate.now())
                .expiredDate(LocalDate.now().plusMonths(3))
                .consultCost(isFromTemplate? 0.0: basedLaborCost + saleMultiplier * complexityScale)
                .designCost(isFromTemplate? 0.0: basedLaborCost + designMultiplier * complexityScale)
                .manufactureCost(basedLaborCost + productionMultiplier * complexityScale)
                .build();

        int index = 0;
        List<QuotationItem> itemList = new LinkedList<>();
        itemList.add(QuotationItem.builder().itemID(index++).name(String.format("%s (%s)", metal.getName(), metal.getUnit())).quantity(specs.getMetalWeight()).unitPrice(metal.getPrice()).unit(metal.getUnit()).totalPrice(specs.getTotalMetalCost()).quotation(quotation).build());
        itemList.add(QuotationItem.builder().itemID(index++).name(gemstone.toStringGemstoneSpec()).quantity(specs.getGemstoneWeight()).unitPrice(gemstone.getPricePerCaratInHundred() * 100.0).unit("Carat").totalPrice(specs.getTotalGemstoneCost()).quotation(quotation).build());
        itemList.add(QuotationItem.builder().itemID(index++).name("Utilities cost").quantity(1).unitPrice(70).unit("Fixed").totalPrice(70.0).quotation(quotation).build());
        itemList.add(QuotationItem.builder().itemID(index++).name("Insurance cost").quantity(1).unitPrice(50).unit("Fixed").totalPrice(50.0).quotation(quotation).build());

        quotation.setQuotationItems(itemList);
        quotation.setMarkupRatio(0.2);

        return quotation;
    }
}
