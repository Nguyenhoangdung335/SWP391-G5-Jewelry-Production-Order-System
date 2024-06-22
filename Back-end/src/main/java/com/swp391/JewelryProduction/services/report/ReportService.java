package com.swp391.JewelryProduction.services.report;

import com.swp391.JewelryProduction.dto.RequestDTOs.ReportRequest;
import com.swp391.JewelryProduction.enums.ConfirmedState;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Report;

public interface ReportService {

    Report saveReport(Report report);
    Report createRequest(ReportRequest report, Order order);
    Report createQuotationReport(ReportRequest report, Order order);
    Report createDesignReport(ReportRequest report, Order order);
    void handleUserResponse(String orderId, boolean isApproved) throws Exception;
    Report createNormalReport(Order order, String title, String content);
    Report findReportByID (Integer id);
    Report updateReport (Report report);
}
