package com.pharmacy.controller;

import com.pharmacy.dto.DeliveryTrackingDTO;
import com.pharmacy.dto.OrderDTO;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.DeliveryTrackingService;
import com.pharmacy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private DeliveryTrackingService deliveryTrackingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.pharmacy.repository.SmsNotificationRepository smsNotificationRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody Map<String, Object> body, Authentication auth) {
        Long addressId = Long.valueOf(body.get("addressId").toString());
        String notes = body.getOrDefault("deliveryNotes", "").toString();
        return ResponseEntity.ok(orderService.placeOrder(getCurrentUser(auth).getId(), addressId, notes));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getOrdersByUser(getCurrentUser(auth).getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderByIdForUser(id, getCurrentUser(auth)));
    }

    @GetMapping("/{id}/track")
    public ResponseEntity<OrderDTO> trackById(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderByIdForUser(id, getCurrentUser(auth)));
    }

    @GetMapping("/{id}/delivery-tracking")
    public ResponseEntity<DeliveryTrackingDTO> getDeliveryTracking(@PathVariable Long id, Authentication auth) {
        // Enforce access check by fetching the order first
        orderService.getOrderByIdForUser(id, getCurrentUser(auth));
        return ResponseEntity.ok(deliveryTrackingService.getDeliveryTracking(id));
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<OrderDTO> trackByNumber(@PathVariable String trackingNumber, Authentication auth) {
        return ResponseEntity.ok(orderService.trackOrderForUser(trackingNumber, getCurrentUser(auth)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }

    @GetMapping("/{id}/sms-preferences")
    public ResponseEntity<Map<String, Object>> getSmsPreferences(@PathVariable Long id, Authentication auth) {
        com.pharmacy.entity.Order order = orderService.getOrderEntityByIdForUser(id, getCurrentUser(auth));
        List<com.pharmacy.entity.SmsNotification> notifs = smsNotificationRepository.findByOrderIdOrderBySentAtDesc(id);
        
        List<Map<String, Object>> notifList = notifs.stream().map(n -> Map.<String, Object>of(
            "type", n.getType(),
            "message", n.getMessage(),
            "sentAt", n.getSentAt().toString()
        )).toList();

        return ResponseEntity.ok(Map.of(
            "enabled", order.getSmsEnabled() != null ? order.getSmsEnabled() : true,
            "phoneNumber", order.getNotificationPhoneNumber() != null ? order.getNotificationPhoneNumber() : "",
            "notifications", notifList
        ));
    }

    @PutMapping("/{id}/sms-preferences")
    public ResponseEntity<?> updateSmsPreferences(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        Boolean enabled = body.get("enabled") != null ? Boolean.valueOf(body.get("enabled").toString()) : true;
        String phoneNumber = body.getOrDefault("phoneNumber", "").toString();
        orderService.updateSmsPreferences(id, enabled, phoneNumber, getCurrentUser(auth));
        return ResponseEntity.ok().build();
    }
}
