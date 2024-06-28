package com.swp391.JewelryProduction.services.design;

import com.swp391.JewelryProduction.dto.DesignDTO;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.repositories.DesignRepository;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesignServiceImpl implements DesignService {
    private DesignRepository designRepository;

    @Override
    public List<Design> findAll() {
        return designRepository.findAll();
    }

    @Override
    public Design findById(String id) {
        return designRepository
                .findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Design of id "+id+" does not exist"));
    }

    @Override
    public Design update(Design design) {
        Design updateDesign = this.findById(design.getId());
        return designRepository.save(design);
    }

    @Override
    public void deleteById(String id) {
        Design design = this.findById(id);
        designRepository.delete(design);
    }

    @Override
    public Design save(Design design) {
        return designRepository.save(design);
    }
}
