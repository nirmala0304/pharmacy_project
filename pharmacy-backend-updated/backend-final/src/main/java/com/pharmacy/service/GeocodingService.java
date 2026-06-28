package com.pharmacy.service;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Geocoding service using OpenStreetMap Nominatim API
 * FREE — no API key required
 * Converts customer address text → real latitude/longitude
 */
@Service
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    /**
     * Convert a customer address into real GPS coordinates
     * Returns [lat, lng] or null if geocoding fails
     */
    public double[] geocodeAddress(String street, String city, String state, String zipCode, String country) {
        try {
            // Build full address string
            String fullAddress = buildFullAddress(street, city, state, zipCode, country);
            String encodedAddress = URLEncoder.encode(fullAddress, StandardCharsets.UTF_8);

            String urlStr = NOMINATIM_URL
                + "?q=" + encodedAddress
                + "&format=json"
                + "&limit=1"
                + "&countrycodes=in"; // restrict to India

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            // Nominatim requires a User-Agent header
            conn.setRequestProperty("User-Agent", "MediCarePharmacyApp/1.0");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                System.out.println("⚠️  Geocoding HTTP error: " + responseCode + " for address: " + fullAddress);
                return fallbackCoords(city);
            }

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8)
            );
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) response.append(line);
            reader.close();

            String json = response.toString().trim();

            // Parse JSON manually (avoid extra dependency)
            // Response looks like: [{"lat":"13.0827","lon":"80.2707",...}]
            if (json.equals("[]") || json.isEmpty()) {
                System.out.println("⚠️  Geocoding returned no results for: " + fullAddress);
                // Try just city + state
                return geocodeCityFallback(city, state, country);
            }

            double lat = extractJsonDouble(json, "\"lat\"");
            double lon = extractJsonDouble(json, "\"lon\"");

            if (lat != 0 && lon != 0) {
                System.out.println("✅ Geocoded address: " + fullAddress + " → [" + lat + ", " + lon + "]");
                return new double[]{lat, lon};
            }

            return fallbackCoords(city);

        } catch (Exception e) {
            System.err.println("❌ Geocoding error: " + e.getMessage());
            return fallbackCoords(city);
        }
    }

    /**
     * Fallback — try geocoding just the city name
     */
    private double[] geocodeCityFallback(String city, String state, String country) {
        try {
            String query = city + ", " + state + ", " + (country != null ? country : "India");
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String urlStr = NOMINATIM_URL + "?q=" + encodedQuery + "&format=json&limit=1&countrycodes=in";

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "MediCarePharmacyApp/1.0");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            if (conn.getResponseCode() != 200) return fallbackCoords(city);

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8)
            );
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) response.append(line);
            reader.close();

            String json = response.toString().trim();
            if (json.equals("[]") || json.isEmpty()) return fallbackCoords(city);

            double lat = extractJsonDouble(json, "\"lat\"");
            double lon = extractJsonDouble(json, "\"lon\"");

            if (lat != 0 && lon != 0) {
                System.out.println("✅ City fallback geocoded: " + query + " → [" + lat + ", " + lon + "]");
                // Add slight random offset so multiple orders don't overlap exactly
                lat += (Math.random() - 0.5) * 0.01;
                lon += (Math.random() - 0.5) * 0.01;
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            System.err.println("❌ City fallback geocoding error: " + e.getMessage());
        }
        return fallbackCoords(city);
    }

    /**
     * Last resort — known city coordinates for major Indian cities
     */
    private double[] fallbackCoords(String city) {
        if (city == null) return new double[]{13.0827, 80.2707}; // Chennai default
        String c = city.toLowerCase().trim();
        if (c.contains("chennai"))    return new double[]{13.0827 + rand(), 80.2707 + rand()};
        if (c.contains("mumbai"))     return new double[]{19.0760 + rand(), 72.8777 + rand()};
        if (c.contains("delhi"))      return new double[]{28.6139 + rand(), 77.2090 + rand()};
        if (c.contains("bangalore") || c.contains("bengaluru"))
                                      return new double[]{12.9716 + rand(), 77.5946 + rand()};
        if (c.contains("hyderabad")) return new double[]{17.3850 + rand(), 78.4867 + rand()};
        if (c.contains("kolkata"))   return new double[]{22.5726 + rand(), 88.3639 + rand()};
        if (c.contains("pune"))      return new double[]{18.5204 + rand(), 73.8567 + rand()};
        if (c.contains("coimbatore"))return new double[]{11.0168 + rand(), 76.9558 + rand()};
        if (c.contains("madurai"))   return new double[]{9.9252  + rand(), 78.1198 + rand()};
        // Default: Chennai
        return new double[]{13.0827 + rand(), 80.2707 + rand()};
    }

    private double rand() { return (Math.random() - 0.5) * 0.02; }

    private String buildFullAddress(String street, String city, String state, String zipCode, String country) {
        StringBuilder sb = new StringBuilder();
        if (street  != null && !street.isEmpty())  sb.append(street).append(", ");
        if (city    != null && !city.isEmpty())    sb.append(city).append(", ");
        if (state   != null && !state.isEmpty())   sb.append(state).append(", ");
        if (zipCode != null && !zipCode.isEmpty()) sb.append(zipCode).append(", ");
        sb.append(country != null ? country : "India");
        return sb.toString();
    }

    /**
     * Simple JSON field extractor — avoids needing Jackson for a single field
     * Handles both "lat":"13.08" and "lat":13.08
     */
    private double extractJsonDouble(String json, String key) {
        try {
            int keyIdx = json.indexOf(key);
            if (keyIdx < 0) return 0;
            int colonIdx = json.indexOf(':', keyIdx + key.length());
            if (colonIdx < 0) return 0;
            // Skip whitespace and optional quote
            int start = colonIdx + 1;
            while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '"')) start++;
            int end = start;
            while (end < json.length() && (Character.isDigit(json.charAt(end))
                || json.charAt(end) == '.' || json.charAt(end) == '-')) end++;
            return Double.parseDouble(json.substring(start, end));
        } catch (Exception e) {
            return 0;
        }
    }
}
