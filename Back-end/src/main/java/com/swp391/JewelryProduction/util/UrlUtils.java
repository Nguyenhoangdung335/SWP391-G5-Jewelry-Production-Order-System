package com.swp391.JewelryProduction.util;

import java.net.URI;
import java.net.URISyntaxException;

public class UrlUtils {
    public static boolean hasQueryParams(String urlString) {
        try {
            URI uri = new URI(urlString);
            String query = uri.getQuery();
            return query != null && !query.isEmpty();
        } catch (URISyntaxException e) {
            throw new RuntimeException("Invalid URL format", e);
        }
    }

    public static String appendQueryParam(String urlString, String paramName, String paramValue) {
        try {
            URI uri = new URI(urlString);
            String query = uri.getQuery();
            String newQueryParam = paramName + "=" + paramValue;

            if (query == null || query.isEmpty()) {
                return uri.toString() + "?" + newQueryParam;
            } else {
                return uri.toString() + "&" + newQueryParam;
            }
        } catch (URISyntaxException e) {
            throw new RuntimeException("Invalid URL format", e);
        }
    }
}
