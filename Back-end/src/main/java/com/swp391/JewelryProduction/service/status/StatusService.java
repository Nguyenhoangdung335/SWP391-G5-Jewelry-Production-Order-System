package com.swp391.JewleryProduction.services.status;

import com.swp391.JewleryProduction.dto.StatusDTO;
import com.swp391.JewleryProduction.pojos.Status;
import com.swp391.JewleryProduction.repositories.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatusService implements IStatusService{
    private StatusRepository statusRepository;

    @Autowired
    public StatusService(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    @Override
    public List<StatusDTO> findAllStatuses() {
        return statusRepository.findAll().stream().map(status -> mapToStatusDTO(status)).collect(Collectors.toList());
    }

    private StatusDTO mapToStatusDTO(Status status) {
        return StatusDTO.builder()
                .statusName(status.getStatusName())
                .id(status.getId())
                .accountList(status.getAccountList())
                .type(status.getType())
                .build();
    }
}
