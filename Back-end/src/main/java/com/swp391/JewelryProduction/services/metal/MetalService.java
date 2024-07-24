package com.swp391.JewelryProduction.services.metal;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MetalService {
    Metal findById(Long metalId);

    List<Metal> findAll();

    Page<Metal> findAll(int page, int pageSize);

    Page<Metal> findAll(int page, int pageSize, String orderBy);

    Metal createMetal(Metal newMetal);

    Metal updateMetal(Metal updatingMetal);

    void deleteMetal(Long metalId);
}
