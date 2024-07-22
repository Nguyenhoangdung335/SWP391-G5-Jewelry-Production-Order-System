package com.swp391.JewelryProduction.services.crawl;

import com.swp391.JewelryProduction.pojos.Price.GemstonePrice;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CrawlDataService {

    void crawData() throws IOException, InterruptedException;

    Flux<ServerSentEvent<List<MetalPrice>>> getAll();

    List<MetalPrice> getAllMetalPrices();
}
