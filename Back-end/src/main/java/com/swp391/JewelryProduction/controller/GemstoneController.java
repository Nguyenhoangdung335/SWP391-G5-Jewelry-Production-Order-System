package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

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
}
