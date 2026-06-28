package com.pharmacy.service;

import com.pharmacy.dto.OrderDTO;
import com.pharmacy.entity.*;
import com.pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private SmsNotificationRepository smsNotificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private TwilioSmsService twilioSmsService;

    @Transactional
    public OrderDTO placeOrder(Long userId, Long addressId, String deliveryNotes) {
        User user = userRepository.findById(userId).orElseThrow();
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart is empty");

        Address address = addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to user");
        }

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(address);
        order.setDeliveryNotes(deliveryNotes);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Medicine medicine = cartItem.getMedicine();

            if (medicine.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + medicine.getName());
            }

            if (medicine.isRequiresPrescription()) {
                if (cartItem.getPrescription() == null || cartItem.getPrescription().getStatus() != Prescription.Status.APPROVED) {
                    throw new RuntimeException("Prescription for '" + medicine.getName() + "' is not approved");
                }
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicine(medicine);
            orderItem.setQuantity(cartItem.getQuantity());

            // Use discountPrice as effective price if set and lower than regular price
            BigDecimal unitPrice = medicine.getPrice();
            BigDecimal discountPrice = medicine.getDiscountPrice();
            if (discountPrice != null && discountPrice.compareTo(BigDecimal.ZERO) > 0
                    && discountPrice.compareTo(unitPrice) < 0) {
                unitPrice = discountPrice;
            }
            orderItem.setUnitPrice(unitPrice);
            orderItem.setPrescription(cartItem.getPrescription());
            orderItems.add(orderItem);

            // Reduce stock
            medicine.setStockQuantity(medicine.getStockQuantity() - cartItem.getQuantity());
            medicineRepository.save(medicine);

            Inventory log = new Inventory();
            log.setMedicine(medicine);
            log.setActionType(Inventory.ActionType.SALE);
            log.setQuantityChanged(-cartItem.getQuantity());
            log.setQuantityAfter(medicine.getStockQuantity());
            log.setNotes("Order placed");
            inventoryRepository.save(log);

            total = total.add(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setItems(orderItems);

        // Apply the same discount the customer saw in their cart, so the
        // amount charged at checkout matches the cart total exactly.
        BigDecimal discount = cartService.getActiveDiscount(cart);
        BigDecimal grandTotal = total.subtract(discount);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) grandTotal = BigDecimal.ZERO;

        order.setTotalAmount(grandTotal);
        order.setDiscountAmount(discount);
        order.setAppliedCouponCode(cart.getAppliedCouponCode());

        Order saved = orderRepository.save(order);

        cartService.clearCart(userId);

        return toDTO(saved);
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByPlacedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        return toDTO(orderRepository.findById(orderId).orElseThrow());
    }

    public OrderDTO getOrderByIdForUser(Long orderId, User user) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (user.getRole() == User.Role.CUSTOMER && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return toDTO(order);
    }

    public Order getOrderEntityById(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    public Order getOrderEntityByIdForUser(Long orderId, User user) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (user.getRole() == User.Role.CUSTOMER && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return order;
    }

    @Transactional
    public void updateSmsPreferences(Long orderId, Boolean enabled, String phoneNumber, User user) {
        Order order = getOrderEntityByIdForUser(orderId, user);
        order.setSmsEnabled(enabled);
        order.setNotificationPhoneNumber(phoneNumber);
        orderRepository.save(order);
    }

    public OrderDTO trackOrder(String trackingNumber) {
        return toDTO(orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Order not found")));
    }

    /** Track by number, but only if the order belongs to the requesting user (or they're staff). */
    public OrderDTO trackOrderForUser(String trackingNumber, User user) {
        Order order = orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (user.getRole() == User.Role.CUSTOMER && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return toDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        Order.OrderStatus newStatus;
        try {
            newStatus = Order.OrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }

        order.setStatus(newStatus);
        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        Order saved = orderRepository.save(order);

        if (Boolean.TRUE.equals(order.getSmsEnabled()) && order.getNotificationPhoneNumber() != null && !order.getNotificationPhoneNumber().isEmpty()) {
            // Build a friendly message for the customer
            String smsText = buildSmsMessage(order.getId(), status);

            // Save notification record in DB
            SmsNotification notif = new SmsNotification();
            notif.setOrder(order);
            notif.setPhoneNumber(order.getNotificationPhoneNumber());
            notif.setType(status);
            notif.setMessage(smsText);
            smsNotificationRepository.save(notif);

            // Send the actual SMS via Twilio
            twilioSmsService.sendSms(order.getNotificationPhoneNumber(), smsText);
        }

        return toDTO(saved);
    }

    /**
     * Build a friendly, human-readable SMS for each order status
     */
    private String buildSmsMessage(Long orderId, String status) {
        String base = "MediCare Pharmacy | Order #" + orderId + ": ";
        return switch (status) {
            case "CONFIRMED"          -> base + "✅ Confirmed! Your order is being prepared.";
            case "PROCESSING"         -> base + "🔄 Processing — our pharmacist is packing your medicines.";
            case "SHIPPED"            -> base + "📦 Shipped! Your order is on its way.";
            case "OUT_FOR_DELIVERY"   -> base + "🛵 Out for delivery! Agent is nearby.";
            case "DELIVERED"          -> base + "🎉 Delivered! Thank you for choosing MediCare.";
            case "DELIVERY_ATTEMPTED" -> base + "⚠️ Delivery attempted. Agent will retry shortly.";
            case "CANCELLED"          -> base + "❌ Cancelled. Contact support for help.";
            default                   -> base + status;
        };
    }

    public OrderDTO toDTO(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.setId(o.getId());
        dto.setUserId(o.getUser().getId());
        dto.setUserEmail(o.getUser().getEmail());
        dto.setUserName(o.getUser().getName());
        dto.setStatus(o.getStatus().name());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setDiscountAmount(o.getDiscountAmount());
        dto.setAppliedCouponCode(o.getAppliedCouponCode());
        dto.setTrackingNumber(o.getTrackingNumber());
        dto.setDeliveryNotes(o.getDeliveryNotes());
        dto.setPlacedAt(o.getPlacedAt());
        dto.setEstimatedDelivery(o.getEstimatedDelivery());
        dto.setDeliveredAt(o.getDeliveredAt());

        if (o.getDeliveryAddress() != null) {
            dto.setDeliveryAddressId(o.getDeliveryAddress().getId());
            // Include full address so frontend can show it and map can geocode it
            com.pharmacy.dto.AddressDTO addrDTO = new com.pharmacy.dto.AddressDTO(
                o.getDeliveryAddress().getId(),
                o.getDeliveryAddress().getFullName(),
                o.getDeliveryAddress().getStreet(),
                o.getDeliveryAddress().getCity(),
                o.getDeliveryAddress().getState(),
                o.getDeliveryAddress().getZipCode(),
                o.getDeliveryAddress().getCountry(),
                o.getDeliveryAddress().getPhone(),
                o.getDeliveryAddress().isDefault()
            );
            dto.setDeliveryAddress(addrDTO);
        }

        if (o.getItems() != null) {
            List<OrderDTO.OrderItemDTO> items = o.getItems().stream().map(item -> {
                OrderDTO.OrderItemDTO itemDTO = new OrderDTO.OrderItemDTO();
                itemDTO.setMedicineId(item.getMedicine().getId());
                itemDTO.setMedicineName(item.getMedicine().getName());
                itemDTO.setMedicineBrand(item.getMedicine().getBrand());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setUnitPrice(item.getUnitPrice());
                if (item.getPrescription() != null) {
                    itemDTO.setPrescriptionId(item.getPrescription().getId());
                }
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setItems(items);
        }

        return dto;
    }
}
