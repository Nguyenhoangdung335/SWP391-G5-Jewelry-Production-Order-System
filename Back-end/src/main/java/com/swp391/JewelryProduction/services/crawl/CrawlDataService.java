package com.swp391.JewelryProduction.services.crawl;

import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import com.swp391.JewelryProduction.repositories.MaterialRepository;
import com.swp391.JewelryProduction.services.connection.ConnectionPage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class    CrawlDataService implements ICrawlDataService {

    private final MaterialRepository materialRepository;
    private final ConnectionPage connection;

    @Value("${exchange.url}")
    private String urlExchange;

    @Value("${page.url}")
    private String urlPage;

    @Override
    public void crawData() {
        log.info("Starting to crawl data ...");
        List<MetalPrice> metalPrices = new ArrayList<>();

        ExecutorService executorService = Executors.newSingleThreadExecutor();

        try {
            CrawlThread crawlThread = CrawlThread.builder()
                    .metalPrices(metalPrices)
                    .connection(connection)
                    .urlExchange(urlExchange)
                    .urlPage(urlPage)
                    .build();

            executorService.execute(crawlThread);

            executorService.shutdown();
            if (!executorService.awaitTermination(300, TimeUnit.SECONDS)) {
                log.warn("Executor did not terminate in the specified time.");
                List<Runnable> droppedTasks = executorService.shutdownNow();
                log.warn("Executor was abruptly shut down. " + droppedTasks.size() + " tasks will not be executed.");
            }

            for (MetalPrice metalPrice : metalPrices) {
                Optional<MetalPrice> existingMaterialOpt = materialRepository.findByName(metalPrice.getName());
                if (existingMaterialOpt.isPresent()) {
                    MetalPrice existingMetalPrice = existingMaterialOpt.get();
                    existingMetalPrice.setPrice(metalPrice.getPrice());
                    existingMetalPrice.setUpdatedTime(metalPrice.getUpdatedTime());
                    materialRepository.save(existingMetalPrice);
                } else {
                    materialRepository.save(metalPrice);
                }
            }            log.info("Finished crawling data!");

        } catch (InterruptedException e) {
            log.error("Crawling was interrupted", e);
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.error("Error during data crawling", e);
        } finally {
            if (!executorService.isTerminated()) {
                log.warn("Forcing executor shutdown...");
                executorService.shutdownNow();
            }
        }
    }

    @Override
    public Flux<ServerSentEvent<List<MetalPrice>>> getAll() {
        return Flux.merge(getHeartBeat(), getPrice());
    }

    private Flux<ServerSentEvent<List<MetalPrice>>> getHeartBeat() {
        return Flux.interval(Duration.ofSeconds(3))
                .map(seq -> ServerSentEvent.<List<MetalPrice>>builder()
                        .id("heartbeat")  // Use priceData size as ID
                        .event("heartbeat")
                        .build());
    }

    private Flux<ServerSentEvent<List<MetalPrice>>> getPrice() {
        List<MetalPrice> list = materialRepository.findAll();
        return Flux.interval(Duration.ofSeconds(10))
                .publishOn(Schedulers.boundedElastic())
                .map(priceData -> ServerSentEvent.<List<MetalPrice>>builder()
                        .id(String.valueOf(list.size()))  // Use priceData size as ID
                        .event("live")
                        .data(list)
                        .build())
                .startWith(ServerSentEvent.<List<MetalPrice>>builder()
                        .id(String.valueOf(list.size()))
                        .event("live")
                        .data(list)
                        .build());
    }

    @Scheduled(fixedRate = 3600000)
    public void scheduledCrawl() {
        try {
            crawData();
        } catch (Exception e) {
            log.error("Scheduled crawling failed", e);
        }
    }


}
