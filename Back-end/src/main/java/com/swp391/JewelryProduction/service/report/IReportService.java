package com.swp391.JewleryProduction.services.report;

import com.swp391.JewleryProduction.dto.ReportDTO;

import java.util.List;

public interface IReportService {
    List<ReportDTO> findAllReports();
}
