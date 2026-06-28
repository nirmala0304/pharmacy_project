package com.pharmacy.dto;

import java.time.LocalDateTime;

public class DeliveryTrackingDTO {

    private Long id;
    private Long orderId;
    private String deliveryAgentName;
    private String deliveryAgentPhone;
    private Double[] deliveryLocation;  // [latitude, longitude]
    private Double[] currentLocation;   // [latitude, longitude]
    private Integer estimatedTimeMinutes;
    private Double distanceKm;
    private String estimatedDelivery;   // Formatted time string like "2 hours"
    private String status;
    private LocalDateTime lastUpdated;

    public DeliveryTrackingDTO() {}

    public DeliveryTrackingDTO(Long id, Long orderId, String deliveryAgentName, String deliveryAgentPhone,
                              Double deliveryLat, Double deliveryLng, Double currentLat, Double currentLng,
                              Integer estimatedTimeMinutes, Double distanceKm, String status, LocalDateTime lastUpdated) {
        this.id = id;
        this.orderId = orderId;
        this.deliveryAgentName = deliveryAgentName;
        this.deliveryAgentPhone = deliveryAgentPhone;
        this.deliveryLocation = new Double[]{deliveryLat, deliveryLng};
        this.currentLocation = new Double[]{currentLat, currentLng};
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.distanceKm = distanceKm;
        this.status = status;
        this.lastUpdated = lastUpdated;
        this.estimatedDelivery = formatTime(estimatedTimeMinutes);
    }

    private static String formatTime(Integer minutes) {
        if (minutes == null) return "Calculating...";
        if (minutes < 60) {
            return minutes + " minutes";
        } else {
            int hours = minutes / 60;
            int mins = minutes % 60;
            return hours + " hour" + (hours > 1 ? "s" : "") + (mins > 0 ? " " + mins + " min" : "");
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getDeliveryAgentName() { return deliveryAgentName; }
    public void setDeliveryAgentName(String deliveryAgentName) { this.deliveryAgentName = deliveryAgentName; }

    public String getDeliveryAgentPhone() { return deliveryAgentPhone; }
    public void setDeliveryAgentPhone(String deliveryAgentPhone) { this.deliveryAgentPhone = deliveryAgentPhone; }

    public Double[] getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(Double[] deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public Double[] getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(Double[] currentLocation) { this.currentLocation = currentLocation; }

    public Integer getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
    public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) { 
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.estimatedDelivery = formatTime(estimatedTimeMinutes);
    }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
