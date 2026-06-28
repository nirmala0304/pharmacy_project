package com.pharmacy.service;

import com.pharmacy.dto.DeliveryTrackingDTO;
import com.pharmacy.entity.DeliveryTracking;
import com.pharmacy.entity.Order;
import com.pharmacy.entity.Address;
import com.pharmacy.repository.DeliveryTrackingRepository;
import com.pharmacy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DeliveryTrackingService {

    @Autowired
    private DeliveryTrackingRepository deliveryTrackingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private GeocodingService geocodingService;

    private static final String[] DELIVERY_AGENTS = {
        "Raj Kumar", "Priya Singh", "Amit Patel", "Neha Sharma", "Vikram Das"
    };

    private static final String[] DELIVERY_PHONES = {
        "9876543210", "9876543211", "9876543212", "9876543213", "9876543214"
    };

    // Pharmacy hub locations (kept for reference)
    // Now using real geocoded customer address instead

    /**
     * Initialize delivery tracking for a new order
     */
    public DeliveryTrackingDTO initializeDeliveryTracking(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }

        Order order = orderOpt.get();

        // Check if tracking already exists
        Optional<DeliveryTracking> existingTracking = deliveryTrackingRepository.findByOrderId(orderId);
        if (existingTracking.isPresent()) {
            return convertToDTO(existingTracking.get());
        }

        DeliveryTracking tracking = new DeliveryTracking(order);

        // Assign random delivery agent
        int agentIndex = new Random().nextInt(DELIVERY_AGENTS.length);
        tracking.setDeliveryAgentName(DELIVERY_AGENTS[agentIndex]);
        tracking.setDeliveryAgentPhone(DELIVERY_PHONES[agentIndex]);

        // Set delivery address location using REAL geocoding from customer address
        Address deliveryAddr = order.getDeliveryAddress();
        if (deliveryAddr != null) {
            System.out.println("📍 Geocoding customer address: "
                + deliveryAddr.getStreet() + ", "
                + deliveryAddr.getCity() + ", "
                + deliveryAddr.getState() + " - "
                + deliveryAddr.getZipCode());

            double[] coords = geocodingService.geocodeAddress(
                deliveryAddr.getStreet(),
                deliveryAddr.getCity(),
                deliveryAddr.getState(),
                deliveryAddr.getZipCode(),
                deliveryAddr.getCountry() != null ? deliveryAddr.getCountry() : "India"
            );
            tracking.setDeliveryLatitude(coords[0]);
            tracking.setDeliveryLongitude(coords[1]);
        } else {
            // No address — use Chennai default
            tracking.setDeliveryLatitude(13.0827 + (Math.random() - 0.5) * 0.05);
            tracking.setDeliveryLongitude(80.2707 + (Math.random() - 0.5) * 0.05);
        }

        // Set initial agent location near the delivery city (pharmacy hub)
        // Start agent ~5-10 km away from delivery point
        double delivLat = tracking.getDeliveryLatitude();
        double delivLng = tracking.getDeliveryLongitude();
        tracking.setCurrentLatitude(delivLat  + (Math.random() * 0.08 + 0.04));
        tracking.setCurrentLongitude(delivLng + (Math.random() * 0.08 + 0.04));

        // Calculate distance and ETA
        double distance = calculateDistance(
            tracking.getCurrentLatitude(), tracking.getCurrentLongitude(),
            tracking.getDeliveryLatitude(), tracking.getDeliveryLongitude()
        );
        tracking.setDistanceKm(distance);
        tracking.setEstimatedTimeMinutes((int) (distance * 3));

        tracking.setStatus(DeliveryTracking.DeliveryStatus.CONFIRMED);

        deliveryTrackingRepository.save(tracking);
        return convertToDTO(tracking);
    }

    /**
     * Simulate real-time location update - moves agent closer to delivery location
     */
    public DeliveryTrackingDTO updateLiveLocation(Long orderId) {
        Optional<DeliveryTracking> trackingOpt = deliveryTrackingRepository.findByOrderId(orderId);
        if (trackingOpt.isEmpty()) {
            return initializeDeliveryTracking(orderId);
        }

        DeliveryTracking tracking = trackingOpt.get();

        // Don't update if already delivered
        if (tracking.getStatus() == DeliveryTracking.DeliveryStatus.DELIVERED) {
            return convertToDTO(tracking);
        }

        double currentLat = tracking.getCurrentLatitude();
        double currentLng = tracking.getCurrentLongitude();
        double deliveryLat = tracking.getDeliveryLatitude();
        double deliveryLng = tracking.getDeliveryLongitude();

        double distance = calculateDistance(currentLat, currentLng, deliveryLat, deliveryLng);

        // Check if delivery agent has reached destination (within 0.5 km)
        if (distance < 0.5) {
            tracking.setCurrentLatitude(deliveryLat);
            tracking.setCurrentLongitude(deliveryLng);
            tracking.setDistanceKm(0.0);
            tracking.setEstimatedTimeMinutes(0);
            tracking.setStatus(DeliveryTracking.DeliveryStatus.DELIVERED);
        } else {
            // Move agent closer to delivery location
            // Move ~0.5 km towards destination per update
            double moveDistance = 0.5;
            double bearing = calculateBearing(currentLat, currentLng, deliveryLat, deliveryLng);
            
            double[] newPosition = moveTowards(currentLat, currentLng, bearing, moveDistance);
            tracking.setCurrentLatitude(newPosition[0]);
            tracking.setCurrentLongitude(newPosition[1]);

            double remainingDistance = calculateDistance(newPosition[0], newPosition[1], deliveryLat, deliveryLng);
            tracking.setDistanceKm(remainingDistance);
            tracking.setEstimatedTimeMinutes((int) (remainingDistance * 3));

            // Update status based on distance
            if (remainingDistance < 3) {
                tracking.setStatus(DeliveryTracking.DeliveryStatus.OUT_FOR_DELIVERY);
            }
        }

        deliveryTrackingRepository.save(tracking);
        return convertToDTO(tracking);
    }

    /**
     * Get current delivery tracking for an order
     */
    public DeliveryTrackingDTO getDeliveryTracking(Long orderId) {
        Optional<DeliveryTracking> tracking = deliveryTrackingRepository.findByOrderId(orderId);
        return tracking.map(this::convertToDTO).orElseGet(() -> initializeDeliveryTracking(orderId));
    }

    /**
     * Convert entity to DTO
     */
    private DeliveryTrackingDTO convertToDTO(DeliveryTracking tracking) {
        return new DeliveryTrackingDTO(
            tracking.getId(),
            tracking.getOrder().getId(),
            tracking.getDeliveryAgentName(),
            tracking.getDeliveryAgentPhone(),
            tracking.getDeliveryLatitude(),
            tracking.getDeliveryLongitude(),
            tracking.getCurrentLatitude(),
            tracking.getCurrentLongitude(),
            tracking.getEstimatedTimeMinutes(),
            tracking.getDistanceKm(),
            tracking.getStatus().toString(),
            tracking.getLastUpdated()
        );
    }

    /**
     * Haversine formula to calculate distance between two coordinates
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Calculate bearing (direction) between two points
     */
    private double calculateBearing(double lat1, double lon1, double lat2, double lon2) {
        double dLon = Math.toRadians(lon2 - lon1);
        double y = Math.sin(dLon) * Math.cos(Math.toRadians(lat2));
        double x = Math.cos(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) -
                   Math.sin(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(dLon);
        return Math.atan2(y, x);
    }

    /**
     * Move a point towards another point by a given distance
     */
    private double[] moveTowards(double lat1, double lon1, double bearing, double distanceKm) {
        final int EARTH_RADIUS_KM = 6371;
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double angularDistance = distanceKm / EARTH_RADIUS_KM;

        double lat2Rad = Math.asin(Math.sin(lat1Rad) * Math.cos(angularDistance) +
                                  Math.cos(lat1Rad) * Math.sin(angularDistance) * Math.cos(bearing));
        double lon2Rad = lon1Rad + Math.atan2(Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1Rad),
                                              Math.cos(angularDistance) - Math.sin(lat1Rad) * Math.sin(lat2Rad));

        return new double[]{Math.toDegrees(lat2Rad), Math.toDegrees(lon2Rad)};
    }
}
