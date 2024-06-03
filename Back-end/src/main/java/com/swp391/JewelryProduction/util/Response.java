package com.swp391.JewelryProduction.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Response {
    private HttpStatus status;
    private String message;
    private Map<String, Object> responseList;

    public static class ResponseBuilder {
        public ResponseBuilder response(String key, Object value) {
            if (responseList == null) responseList = new HashMap<>();
            responseList.put(key, value);
            return this;
        }

        public ResponseEntity<Response> buildEntity() {
            return new ResponseEntity<>(new Response(status, message, responseList), status);
        }
    }
}
