package com.swp391.JewelryProduction.services.connection;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ConnectionPageService implements ConnectionPage{

    @Override
    public Document getConnection(String url) throws IOException {
        return Jsoup
                .connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Accept-Language", "*")
                .timeout(5 * 60 * 1000)
                .get();
    }

}
