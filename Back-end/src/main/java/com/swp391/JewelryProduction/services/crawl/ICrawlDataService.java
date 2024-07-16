package com.swp391.JewelryProduction.services.crawl;

import com.swp391.JewelryProduction.pojos.Price.GemstonePrice;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

public interface ICrawlDataService {

    void crawData() throws IOException, InterruptedException;
    Flux<ServerSentEvent<List<MetalPrice>>> getAll();
    List<GemstonePrice> getGemstones();
    GemstonePrice createGemstone(GemstonePrice gemstone);
    GemstonePrice updateGemstone(GemstonePrice gemstone);
    void deleteGemstone(Integer id);
}
