package com.swp391.JewelryProduction.controller;

import com.swp391.JewelryProduction.dto.DataDTO;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import com.swp391.JewelryProduction.pojos.gemstone.Gemstone;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import com.swp391.JewelryProduction.services.gemstone.GemstoneService;
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

    private final CrawlDataService crawlDataService;
    private final GemstoneService gemstoneService;

    @PostMapping
    public ResponseEntity<DataDTO> crawlingData() {
        try {
            crawlDataService.crawData();
            return ResponseEntity.ok(
                    DataDTO.builder().isSuccess(true).status(HttpStatus.OK.value()).message("Crawl data is successful !")
                            .build());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DataDTO.builder().isSuccess(false).status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Failed to crawl data: " + e.getMessage()).build());
        }
    }

    @GetMapping()
    public Flux<ServerSentEvent<List<MetalPrice>>> getPrice() throws IOException {
        return crawlDataService.getAll();
    }

    @GetMapping("/gemstones")
    public ResponseEntity<Response> getGemstones() {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstones", gemstoneService.getGemstones())
                .buildEntity();
    }

    @GetMapping("/gemstone")
    public ResponseEntity<Response> getGemstone(@RequestParam("id") long id) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstoneService.getGemstone(id))
                .buildEntity();
    }

    @PostMapping("/create/gemstone")
    public ResponseEntity<Response> createGemstone(@RequestBody Gemstone gemstone) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstoneService.createGemstone(gemstone))
                .buildEntity();
    }

    @PutMapping("/update/gemstone")
    public ResponseEntity<Response> updateGemstone(@RequestBody Gemstone gemstone) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("gemstone", gemstoneService.updateGemstone(gemstone))
                .buildEntity();
    }

    @DeleteMapping
    public ResponseEntity<Response> deleteGemstone(@RequestParam long id) {
        return Response.builder()
                .status(HttpStatus.OK)
                .message("Request sent successfully.")
                .response("result", gemstoneService.deleteGemstone(id) ? "Gemstone with ID " + id + " is existed in database" : "Gemstone with ID " + id + " is not existed in database")
                .buildEntity();
    }
}
