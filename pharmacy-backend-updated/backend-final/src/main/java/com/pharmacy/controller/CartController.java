package com.pharmacy.controller;

import com.pharmacy.dto.CartDTO;
import com.pharmacy.entity.User;
import com.pharmacy.repository.UserRepository;
import com.pharmacy.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(getCurrentUser(auth).getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(@RequestBody Map<String, Object> body, Authentication auth) {
        Long medicineId = Long.valueOf(body.get("medicineId").toString());
        Integer quantity = Integer.valueOf(body.getOrDefault("quantity", 1).toString());
        Long prescriptionId = body.containsKey("prescriptionId") && body.get("prescriptionId") != null
                ? Long.valueOf(body.get("prescriptionId").toString()) : null;

        return ResponseEntity.ok(cartService.addToCart(getCurrentUser(auth).getId(), medicineId, quantity, prescriptionId));
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long cartItemId,
                                                   @RequestBody Map<String, Integer> body,
                                                   Authentication auth) {
        return ResponseEntity.ok(cartService.updateQuantity(getCurrentUser(auth).getId(), cartItemId, body.get("quantity")));
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<CartDTO> removeItem(@PathVariable Long cartItemId, Authentication auth) {
        return ResponseEntity.ok(cartService.removeItem(getCurrentUser(auth).getId(), cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication auth) {
        cartService.clearCart(getCurrentUser(auth).getId());
        return ResponseEntity.ok("Cart cleared.");
    }

    @PostMapping("/coupon")
    public ResponseEntity<CartDTO> applyCoupon(@RequestBody Map<String, String> body, Authentication auth) {
        String code = body.get("code");
        if (code == null || code.isBlank()) {
            throw new RuntimeException("Please enter a coupon code.");
        }
        return ResponseEntity.ok(cartService.applyCoupon(getCurrentUser(auth).getId(), code));
    }

    @DeleteMapping("/coupon")
    public ResponseEntity<CartDTO> removeCoupon(Authentication auth) {
        return ResponseEntity.ok(cartService.removeCoupon(getCurrentUser(auth).getId()));
    }
}
