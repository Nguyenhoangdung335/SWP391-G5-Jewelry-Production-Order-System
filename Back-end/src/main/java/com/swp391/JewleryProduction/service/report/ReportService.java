package com.swp391.JewleryProduction.services.report;

import com.swp391.JewleryProduction.dto.ReportDTO;
import com.swp391.JewleryProduction.pojos.Report;
import com.swp391.JewleryProduction.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService implements IReportService{
    private ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }
    @Override
    public List<ReportDTO> findAllReports() {
        return reportRepository.findAll().stream().map(report -> mapToReportDTO(report)).collect(Collectors.toList());
    }

    private ReportDTO mapToReportDTO(Report report) {
        return ReportDTO.builder()
                .type(report.getType())
                .id(report.getId())
                .title(report.getTitle())
                .createdDate(report.getCreatedDate())
                .description(report.getDescription())
                .sender(report.getSender())
                .build();
    }
}
