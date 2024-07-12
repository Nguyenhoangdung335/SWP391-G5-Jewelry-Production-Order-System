package com.swp391.JewelryProduction.services.report;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.enums.ConfirmedState;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.Report;
import com.swp391.JewelryProduction.pojos.designPojos.Product;

public interface ReportService {

    Report saveReport(Report report);
    Report createRequest(ReportRequest report, Order order, Product product);
    Report createQuotationReport(ReportRequest report, Order order, Quotation quotation);
    Report createDesignReport(ReportRequest report, Order order, Design design);
    void handleUserResponse(int notificationId, String orderId, boolean isApproved) throws Exception;
    Report createNormalReport(Order order, String title, String content);
    Report findReportByID (Integer id);
    Report updateReport (Report report);
}
