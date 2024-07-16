package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.DataDTO;
import com.swp391.JewelryProduction.pojos.Price.GemstonePrice;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.crawl.ICrawlDataService;
import com.swp391.JewelryProduction.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/crawls")
public class CrawlController {

    private final ICrawlDataService CrawDataService;
    private final CrawlDataService crawlDataService;

    @PostMapping
    public ResponseEntity<DataDTO> crawlingData() {
        try {
            CrawDataService.crawData();
            return ResponseEntity.ok(
                    DataDTO.builder().isSuccess(true).status(HttpStatus.OK.value()).message("Crawl data is successful !")
                            .build());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DataDTO.builder().isSuccess(false).status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to crawl data: " + e.getMessage()).build());
        }
    }

    @GetMapping("/gold")
    public Flux<ServerSentEvent<List<MetalPrice>>> getPrice() throws IOException {
        return CrawDataService.getAll();
    }

    @GetMapping("/gemstone")
    public ResponseEntity<Response> getGemstone() {
        return Response.builder()
                .message("Request sent successfully")
                .status(HttpStatus.OK)
                .response("gemstonePrices", CrawDataService.getGemstones())
                .buildEntity();
    }

    @PostMapping("/create/gemstone")
    public ResponseEntity<Response> createGemstone(@RequestBody GemstonePrice gemstone) {
        return Response.builder()
                .message("Request sent successfully")
                .status(HttpStatus.OK)
                .response("gemstone", crawlDataService.createGemstone(gemstone))
                .buildEntity();
    }

    @PutMapping("/update/gemstone")
    public ResponseEntity<Response> updateGemstone(@RequestBody GemstonePrice gemstone) {
        return Response.builder()
                .message("Request sent successfully")
                .status(HttpStatus.OK)
                .response("gemstone", crawlDataService.updateGemstone(gemstone))
                .buildEntity();
    }

    @DeleteMapping("/delete/gemstone")
    public ResponseEntity<Response> deleteGemstone(@RequestParam int id) {
        crawlDataService.deleteGemstone(id);
        return Response.builder()
                .message("Request sent successfully")
                .status(HttpStatus.OK)
                .buildEntity();
    }
}
