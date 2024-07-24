package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.RequestDTOs.GemstoneRequest;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.util.Response;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/gemstone")
public class GemstoneController {
    private final GemstoneService gemstoneService;
    private final CrawlDataService crawlDataService;

    @GetMapping("/factors")
    public ResponseEntity<Response> getGemstoneFactor () {
        return Response.builder()
                .responseList(gemstoneService.getGemstoneFactor())
                .response("metal", crawlDataService.getAllMetalPrices())
                .buildEntity();
    }

    @GetMapping("")
    public ResponseEntity<Response> getAllGemstones(
            @RequestParam("page") int page,
            @RequestParam("size") int pageSize,
            @RequestParam(name = "sortBy", defaultValue = "caratWeightFrom") String sortBy
    ) {
        Page<Gemstone> gemstonePage = gemstoneService.findAll(page, pageSize, sortBy);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstonePage.getContent())
                .response("totalPages", gemstonePage.getTotalPages())
                .response("totalElements", gemstonePage.getTotalElements())
                .buildEntity();
    }

    @PostMapping("/search")
    public ResponseEntity<Response> getSearchedGemstones (
            @RequestBody @Valid GemstoneRequest gemstoneRequest
    ) {
        return Response.builder()
                .response("gemstone", gemstoneService.searchByProperties(gemstoneRequest))
                .buildEntity();
    }

    @PostMapping("")
    public ResponseEntity<Response> createGemstoneType(@RequestBody @Valid Gemstone gemstone) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstoneService.createGemstone(gemstone))
                .buildEntity();
    }

    @PutMapping("")
    public ResponseEntity<Response> updateGemstoneType(@RequestBody @Valid Gemstone gemstone) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstoneService.updateGemstone(gemstone))
                .buildEntity();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteGemstone(@PathVariable("id") long id) {
        gemstoneService.deleteGemstone(id);
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .buildEntity();
    }
}
