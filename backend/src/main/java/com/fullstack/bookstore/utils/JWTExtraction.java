package com.fullstack.bookstore.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class JWTExtraction {

    public static String payloadJWTExtraction(String token, String extraction) {
        // removing the bearer string from the token
        token.replace("Bearer ", "");

        // splitting the token into header, payload and signature
        String[] chunks = token.split("\\.");

        // decoding the payload into JSON
        Base64.Decoder decoder = Base64.getDecoder();
        String payload = new String(decoder.decode(chunks[1]));

        // putting each element of JSON object into an array
        String[] entries = payload.split(",");

        Map<String, String> map = new HashMap<>();
        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {
                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }

        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }

        return null;
    }
}
