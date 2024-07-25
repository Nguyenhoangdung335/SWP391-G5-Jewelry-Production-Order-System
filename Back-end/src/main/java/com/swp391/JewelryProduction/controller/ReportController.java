package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.Report;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.design.DesignService;
import com.swp391.JewelryProduction.services.order.OrderService;
import com.swp391.JewelryProduction.services.product.ProductService;
import com.swp391.JewelryProduction.services.quotation.QuotationService;
import com.swp391.JewelryProduction.services.report.ReportService;
import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.util.exceptions.ObjectExistsException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {
    private final OrderService orderService;
    private final ReportService reportService;
    private final AccountService accountService;
    private final ProductService productService;
    private final QuotationService quotationService;
    private final DesignService designService;

    @PostMapping("/{senderId}/{productSpecId}/create/request")
    public ResponseEntity<Response> createRequest(
            @Valid @RequestBody ReportRequest request,
            @PathVariable("productSpecId") Integer specificationId,
            @PathVariable("senderId") String senderId,
            @RequestParam(name = "template", required = false, defaultValue = "false") boolean isFromTemplate
    ) {
        request.setReportContentID(String.valueOf(specificationId));
        request.setSenderId(senderId);

        if (accountService.checkCurrentOrderExist(senderId))
            throw new ObjectExistsException("Your account currently has an on-going order");
        ProductSpecification specification;
        Product product;
        Order order = orderService.saveNewOrder(senderId, isFromTemplate);

        try {
            specification = productService
                    .findProductSpecificationById(
                            Integer.parseInt(request.getReportContentID())
                    );
            if (!order.isFromTemplate()) {
                product = productService.saveProduct(Product.builder()
                        .specification(specification)
                        .build());
            } else {
                product = specification.getProduct();
            }
        } catch (NumberFormatException ex) {
            throw new RuntimeException(ex);
        }

        Report report = reportService.createRequestReport(request, order, product);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("orderId", report.getReportingOrder().getId())
                .buildEntity();
    }

    @PostMapping("/{senderId}/{orderId}/create/quote")
    public ResponseEntity<Response> createQuoteReport(
            @Valid @RequestBody ReportRequest quoteReport,
            @PathVariable("senderId") String senderId,
            @PathVariable("orderId") String orderId)
    {
        quoteReport.setSenderId(senderId);
        Quotation quotation = quotationService.findById(quoteReport.getReportContentID());
        reportService.createQuotationReport(quoteReport, orderService.findOrderById(orderId), quotation);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }

    @PostMapping("/{senderId}/{orderId}/create/design")
    public ResponseEntity<Response> createDesignReport(
            @Valid @RequestBody ReportRequest designReport,
            @PathVariable("senderId") String senderId,
            @PathVariable("orderId") String orderId)
    {
        designReport.setSenderId(senderId);
        Design design = designService.findById(designReport.getReportContentID());
        reportService.createDesignReport(designReport, orderService.findOrderById(orderId), design);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }

    @PostMapping("/{senderId}/{orderId}/create/product")
    public ResponseEntity<Response> createProductionReport(
            @Valid @RequestBody ReportRequest productReport,
            @PathVariable("senderId") String senderId,
            @PathVariable("orderId") String orderId)
    {
        productReport.setSenderId(senderId);
        reportService.createFinishedProductReport(productReport, orderService.findOrderById(orderId));
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }

//    @PostMapping("/{senderId}/request-template")
//    public ResponseEntity<Response> requestForExistingTemplate (
//            @Valid @RequestBody ReportRequest productReport,
//            @PathVariable("senderId") String senderId
//    ) {
//        productReport.setSenderId(senderId);
//
//    }
}
