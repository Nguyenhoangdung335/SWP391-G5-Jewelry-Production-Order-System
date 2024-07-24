package com.swp391.JewelryProduction.services.metal;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.repositories.MetalRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetalServiceImpl implements MetalService{
    private final MetalRepository metalRepository;

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
        return metalRepository.save(searchMetal.copyValue(updatingMetal));
    }

    @Override
    public void deleteMetal (Long metalId) {
        Metal deletingMetal = metalRepository.findById(metalId).orElseThrow(
                () -> new ObjectNotFoundException("Metal with Id "+metalId+" does not exist, cannot delete")
        );
        metalRepository.delete(deletingMetal);
    }
}
