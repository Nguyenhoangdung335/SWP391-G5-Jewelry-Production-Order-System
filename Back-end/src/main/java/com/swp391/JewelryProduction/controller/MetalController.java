package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.services.metal.MetalService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metal")
@RequiredArgsConstructor
public class MetalController {
    private final MetalService metalService;

    @GetMapping("")
    public ResponseEntity<Response> findAll(
            @RequestParam("page") int page,
            @RequestParam("size") int pageSize,
            @RequestParam(name = "sortBy", defaultValue = "unit") String sortBy
    ) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metals", metalService.findAll(page, pageSize, sortBy).getContent())
                .response("totalPages", metalService.findAll(page, pageSize, sortBy).getTotalPages())
                .response("totalElements", metalService.findAll(page, pageSize, sortBy).getTotalElements())
                .buildEntity();
    }

    @GetMapping("/search")
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
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metal", metalService.createMetal(metal))
                .buildEntity();
    }

    @Transactional
    @PutMapping("")
    public ResponseEntity<Response> update(
            @RequestBody @Valid Metal metal
    ) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully")
                .response("metal", metalService.updateMetal(metal))
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
                .message("Request sent successfully")
                .buildEntity();
    }
}
