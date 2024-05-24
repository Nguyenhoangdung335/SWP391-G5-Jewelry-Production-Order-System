package com.swp391.JewleryProduction.services.status;

import com.swp391.JewleryProduction.dto.StatusDTO;

import java.util.List;

public interface IStatusService {
    List<StatusDTO> findAllStatuses();
}
