package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.services.metal.MetalService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metal")
@RequiredArgsConstructor
public class MetalController {
    private final MetalService metalService;

    @GetMapping("/factor")
    public ResponseEntity<Response> getMetalFactors () {
        return Response.builder()
                .responseList(metalService.getAllMetalFactors())
                .buildEntity();
    }

    @GetMapping("")
    public ResponseEntity<Response> findAll(
            @RequestParam("page") int page,
            @RequestParam("size") int pageSize,
            @RequestParam(name = "sortBy", defaultValue = "unit") String sortBy
    ) {
        Page<Metal> metalPage = metalService.findAll(page, pageSize, sortBy);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metals", metalPage.getContent())
                .response("totalPages", metalPage.getTotalPages())
                .response("totalElements", metalPage.getTotalElements())
                .buildEntity();
    }

    @PostMapping("/search")
    public ResponseEntity<Response> findSearchedMetals (
            @RequestBody Metal metal
    ) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metal", metalService.findByProperties(metal))
                .buildEntity();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> findById(
            @PathVariable("id") long id
    ) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metal", metalService.findById(id))
                .buildEntity();
    }

    @Transactional
    @PostMapping("")
    public ResponseEntity<Response> createMetal(
            @RequestBody @Valid Metal metal
    ) {
        Metal createdMetal = metalService.createMetal(metal);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Successfully create metal with ID " + createdMetal.getId())
                .response("metal", createdMetal)
                .buildEntity();
    }

    @Transactional
    @PutMapping("")
    public ResponseEntity<Response> update(
            @RequestBody @Valid Metal metal
    ) {
        Metal updatedMetal = metalService.updateMetal(metal);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Successfully update metal with ID " + updatedMetal.getId())
                .response("metal", updatedMetal)
                .buildEntity();
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Response> delete(
            @PathVariable("id") long id
    ) {
        metalService.deleteMetal(id);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Successfully delete metal with ID " + id)
                .buildEntity();
    }
}
