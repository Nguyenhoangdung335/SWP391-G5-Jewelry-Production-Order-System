package com.swp391.JewelryProduction.services.crawl;

import com.swp391.JewelryProduction.pojos.Material;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

public interface ICrawlDataService {

    void crawData() throws IOException, InterruptedException;
    Flux<ServerSentEvent<List<Material>>> getAll();
    void addMaterial(Material material);
    void deleteMaterial(Long id);
    void updateMaterial(Material material);

}
