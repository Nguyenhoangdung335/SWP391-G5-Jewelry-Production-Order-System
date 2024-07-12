package com.swp391.JewelryProduction.dto.ResponseDTOs;

import com.swp391.JewelryProduction.enums.ReportType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private Integer id;
    private Integer reportID;
    private String reportTitle;
    private String reportDescription;
    private LocalDateTime reportCreatedDate;
    private ReportType reportType;
    private String reportSenderID;
    private String orderID;
    private String receiverID;
    private boolean delivered;
    private boolean read;
    private boolean isOption;
}
