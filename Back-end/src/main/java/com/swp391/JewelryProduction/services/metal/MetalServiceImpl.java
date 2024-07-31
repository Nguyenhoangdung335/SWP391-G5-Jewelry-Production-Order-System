package com.swp391.JewelryProduction.services.metal;

import com.swp391.JewelryProduction.dto.ResponseDTOs.MetalResponse;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.repositories.MetalRepository;
import com.swp391.JewelryProduction.repositories.ProductSpecificationRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MetalServiceImpl implements MetalService{
    private final MetalRepository metalRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final ModelMapper modelMapper;

    @Override
    public Metal findById (Long metalId) {
        return metalRepository.findById(metalId).orElseThrow(
                () -> new ObjectNotFoundException("Metal with id "+metalId+" does not exist")
        );
    }

    @Override
    public List<Metal> findAll () {
        return metalRepository.findAll();
    }

    @Override
    public Page<Metal> findAll (int page, int pageSize) {
        return this.findAll(page, pageSize, "updatedTime");
    }

    @Override
    public Page<Metal> findAll (int page, int pageSize, String orderBy) {
        return metalRepository.findAll(PageRequest.of(page, pageSize, Sort.by(orderBy).ascending()));
    }

    @Override
    public Metal createMetal (Metal newMetal) {
        return metalRepository.save(newMetal);
    }

    @Override
    public Metal updateMetal (Metal updatingMetal) {
        Metal searchMetal = metalRepository.findById(updatingMetal.getId()).orElseThrow(
                () -> new ObjectNotFoundException("Metal with Id "+updatingMetal.getId()+" does not exist, cannot update")
        );
        updatingMetal.setUpdatedTime(LocalDateTime.now());
        return metalRepository.save(searchMetal.copyValue(updatingMetal));
    }

    @Override
    public void deleteMetal (long metalId) {
        Metal deletingMetal = metalRepository.findById(metalId).orElseThrow(
                () -> new ObjectNotFoundException("Metal with Id "+metalId+" does not exist, cannot delete")
        );
        if(productSpecificationRepository.existsByMetalId(metalId)) {
            throw new DataIntegrityViolationException("Cannot delete metal due to existing constraints.");
        } else metalRepository.delete(deletingMetal);
    }

    @Override
    public List<Metal> findByProperties(Metal metal) {
        if(metal.getMarketPrice() == 0.0 && metal.getCompanyPrice() == 0.0) {
            return metalRepository.findAllByNameAndUnit(metal.getName(),metal.getUnit());
        }
        return metalRepository.findBySearch(metal.getName(),
                                            metal.getUnit(),
                                            metal.getMarketPrice(),
                                            metal.getCompanyPrice());
    }

    @Override
    public Map<String, Object> getAllMetalFactors() {
        List<Metal> metals = metalRepository.findAll(Sort.by("name").ascending().and(Sort.by("unit").ascending()));
        Map<String, List<Object>> metalsByName = new HashMap<>();
        List<String> metalNames = new ArrayList<>();

        metals.forEach( (metal) -> {
            String currName = metal.getName();
            if (metalsByName.containsKey(currName)) {
                metalsByName.get(currName).add(metal);
            } else {
                List<Object> temp = new ArrayList<>();
                temp.add(modelMapper.map(metal, MetalResponse.class));
                metalsByName.put(currName, temp);
                metalNames.add(currName);
            }
        });

        Map<String, Object> factors = new HashMap<>();
        factors.put("names", metalNames);
        factors.put("metalsByName", metalsByName);
        return factors;
    }
}
