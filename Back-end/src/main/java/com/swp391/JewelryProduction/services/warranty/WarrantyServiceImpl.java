package com.swp391.JewelryProduction.services.warranty;

import com.swp391.JewelryProduction.pojos.Warranty;
import com.swp391.JewelryProduction.repositories.WarrantyRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarrantyServiceImpl implements WarrantyService{
    private final WarrantyRepository warrantyRepository;

    @Override
    public Warranty findById(Long id) {
        return warrantyRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Warranty not found"));
    }
}
