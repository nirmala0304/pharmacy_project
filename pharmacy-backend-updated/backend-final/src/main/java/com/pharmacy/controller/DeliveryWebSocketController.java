package com.pharmacy.controller;

import com.pharmacy.dto.DeliveryTrackingDTO;
import com.pharmacy.service.DeliveryTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class DeliveryWebSocketController {

    @Autowired
    private DeliveryTrackingService deliveryTrackingService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Subscribe to real-time delivery tracking updates
     * Client sends: /app/subscribe/{orderId}
     * Server broadcasts to: /topic/delivery/{orderId}
     */
    @MessageMapping("/subscribe/{orderId}")
    @SendTo("/topic/delivery/{orderId}")
    public DeliveryTrackingDTO subscribeToDeliveryUpdates(String orderId) {
        Long id = Long.parseLong(orderId);
        return deliveryTrackingService.getDeliveryTracking(id);
    }

    /**
     * Request location update
     * Client sends: /app/update-location/{orderId}
     * Server broadcasts to: /topic/delivery/{orderId}
     */
    @MessageMapping("/update-location/{orderId}")
    @SendTo("/topic/delivery/{orderId}")
    public DeliveryTrackingDTO requestLocationUpdate(String orderId) {
        Long id = Long.parseLong(orderId);
        return deliveryTrackingService.updateLiveLocation(id);
    }

    /**
     * Manually push delivery update to all subscribers of an order
     */
    public void broadcastDeliveryUpdate(Long orderId, DeliveryTrackingDTO tracking) {
        messagingTemplate.convertAndSend("/topic/delivery/" + orderId, tracking);
    }
}
