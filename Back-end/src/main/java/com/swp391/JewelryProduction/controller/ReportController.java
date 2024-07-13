package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.pojos.Design;
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
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @PostMapping("/{accountId}/{productSpecId}/create/request")
    public ResponseEntity<Response> createRequest(
            @Valid @RequestBody ReportRequest request,
            @PathVariable("productSpecId") Integer specificationId,
            @PathVariable("accountId") String accountId)
    {
        request.setReportContentID(String.valueOf(specificationId));
        request.setSenderId(accountId);

        if (accountService.checkCurrentOrderExist(accountId))
            throw new ObjectExistsException("Your account currently has an on-going order");
        ProductSpecification specification;
        Product product;

        try {
            specification = productService
                    .findProductSpecificationById(
                            Integer.parseInt(request.getReportContentID())
                    );
            product = productService.saveProduct(Product.builder()
                    .specification(specification)
                    .build());
        } catch (NumberFormatException ex) {
            throw new RuntimeException(ex);
        }

        Report report = reportService.createRequest(request, orderService.saveNewOrder(accountId), product);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("orderId", report.getReportingOrder().getId())
                .buildEntity();
    }

    @PostMapping("/{accountId}/{orderId}/create/quote")
    public ResponseEntity<Response> createQuoteReport(
            @Valid @RequestBody ReportRequest quoteReport,
            @PathVariable("accountId") String accountId,
            @PathVariable("orderId") String orderId)
    {
        quoteReport.setSenderId(accountId);
        Quotation quotation = quotationService.findById(quoteReport.getReportContentID());
        reportService.createQuotationReport(quoteReport, orderService.findOrderById(orderId), quotation);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }

    @PostMapping("/{accountId}/{orderId}/create/design")
    public ResponseEntity<Response> createDesignReport(
            @Valid @RequestBody ReportRequest designReport,
            @PathVariable("accountId") String accountId,
            @PathVariable("orderId") String orderId)
    {
        designReport.setSenderId(accountId);
        Design design = designService.findById(designReport.getReportContentID());
        reportService.createDesignReport(designReport, orderService.findOrderById(orderId), design);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }

    @PostMapping("/{accountId}/{orderId}/create/product")
    public ResponseEntity<Response> createProductionReport(
            @Valid @RequestBody ReportRequest productReport,
            @PathVariable("accountId") String accountId,
            @PathVariable("orderId") String orderId)
    {
        productReport.setSenderId(accountId);
        reportService.createFinishedProductReport(productReport, orderService.findOrderById(orderId));
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Report created successfully.")
                .buildEntity();
    }
}
