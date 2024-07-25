package com.swp391.JewelryProduction.services.crawl;

import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

public interface CrawlDataService {

    void crawData() throws IOException, InterruptedException;

    Flux<ServerSentEvent<List<Metal>>> getAll();

    List<Metal> getAllMetalPrices();
}
