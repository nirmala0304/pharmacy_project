package com.pharmacy.service;

import com.pharmacy.dto.CartDTO;
import com.pharmacy.entity.*;
import com.pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private CouponRepository couponRepository;

    public CartDTO getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) return emptyCart();
        return toDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(Long userId, Long medicineId, Integer quantity, Long prescriptionId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (!medicine.isActive()) {
            throw new RuntimeException("This medicine is no longer available.");
        }
        if (medicine.getStockQuantity() <= 0) {
            throw new RuntimeException(medicine.getName() + " is out of stock.");
        }
        if (quantity > medicine.getStockQuantity()) {
            throw new RuntimeException("Only " + medicine.getStockQuantity() + " unit(s) of " + medicine.getName() + " available.");
        }

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndMedicineId(cart.getId(), medicineId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + quantity;
            if (newQty > medicine.getStockQuantity()) {
                throw new RuntimeException("Only " + medicine.getStockQuantity() + " unit(s) of " + medicine.getName() + " available. You already have " + item.getQuantity() + " in cart.");
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setMedicine(medicine);
            item.setQuantity(quantity);
            if (prescriptionId != null) {
                prescriptionRepository.findById(prescriptionId).ifPresent(item::setPrescription);
            }
            cartItemRepository.save(item);
        }

        return toDTO(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Transactional
    public CartDTO updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow();

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            int available = item.getMedicine().getStockQuantity();
            if (quantity > available) {
                throw new RuntimeException("Only " + available + " unit(s) of " + item.getMedicine().getName() + " available.");
            }
            item.setQuantity(quantity);
        }
        cartRepository.save(cart);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO removeItem(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow();

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartRepository.save(cart);
        return toDTO(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setAppliedCouponCode(null);
            cartRepository.save(cart);
        });
    }

    @Transactional
    public CartDTO applyCoupon(Long userId, String code) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Your cart is empty.");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new RuntimeException("Invalid coupon code."));

        if (!coupon.isActive()) {
            throw new RuntimeException("This coupon is no longer active.");
        }
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("This coupon has expired.");
        }

        BigDecimal subtotal = calculateSubtotal(cart);
        BigDecimal minOrder = coupon.getMinOrderAmount() != null ? coupon.getMinOrderAmount() : BigDecimal.ZERO;
        if (subtotal.compareTo(minOrder) < 0) {
            throw new RuntimeException("Add items worth at least \u20B9" + minOrder + " to use this coupon.");
        }

        cart.setAppliedCouponCode(coupon.getCode().toUpperCase());
        cartRepository.save(cart);
        return toDTO(cart);
    }

    @Transactional
    public CartDTO removeCoupon(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.setAppliedCouponCode(null);
        cartRepository.save(cart);
        return toDTO(cart);
    }

    private BigDecimal calculateSubtotal(Cart cart) {
        return cart.getItems().stream()
                .map(i -> {
                    BigDecimal price = i.getMedicine().getPrice();
                    BigDecimal disc  = i.getMedicine().getDiscountPrice();
                    BigDecimal effective = (disc != null && disc.compareTo(BigDecimal.ZERO) > 0 && disc.compareTo(price) < 0) ? disc : price;
                    return effective.multiply(BigDecimal.valueOf(i.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Returns the discount amount currently applicable to this cart, given its
     * appliedCouponCode (if any) and current subtotal. Returns ZERO if no coupon
     * is applied or the coupon is no longer valid. Does not mutate the cart.
     * Used by both CartService (for display) and OrderService (at checkout)
     * so the amount charged always matches what the customer saw in the cart.
     */
    public BigDecimal getActiveDiscount(Cart cart) {
        String couponCode = cart.getAppliedCouponCode();
        if (couponCode == null || cart.getItems().isEmpty()) return BigDecimal.ZERO;

        BigDecimal subtotal = calculateSubtotal(cart);
        Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(couponCode);
        if (couponOpt.isEmpty()) return BigDecimal.ZERO;

        Coupon coupon = couponOpt.get();
        BigDecimal minOrder = coupon.getMinOrderAmount() != null ? coupon.getMinOrderAmount() : BigDecimal.ZERO;
        boolean valid = coupon.isActive()
                && (coupon.getExpiryDate() == null || !coupon.getExpiryDate().isBefore(LocalDate.now()))
                && subtotal.compareTo(minOrder) >= 0;

        return valid ? calculateDiscount(subtotal, coupon) : BigDecimal.ZERO;
    }

    private BigDecimal calculateDiscount(BigDecimal subtotal, Coupon coupon) {
        if (coupon == null) return BigDecimal.ZERO;

        BigDecimal discount;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }
        return discount;
    }

    private CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getId());

        List<CartDTO.CartItemDTO> items = cart.getItems().stream().map(item -> {
            CartDTO.CartItemDTO itemDTO = new CartDTO.CartItemDTO();
            itemDTO.setCartItemId(item.getId());
            itemDTO.setMedicineId(item.getMedicine().getId());
            itemDTO.setMedicineName(item.getMedicine().getName());
            itemDTO.setMedicineBrand(item.getMedicine().getBrand());
            // Use discountPrice as unit price if available and lower than regular price
            java.math.BigDecimal unitPrice = item.getMedicine().getPrice();
            java.math.BigDecimal discountPrice = item.getMedicine().getDiscountPrice();
            if (discountPrice != null && discountPrice.compareTo(java.math.BigDecimal.ZERO) > 0
                    && discountPrice.compareTo(unitPrice) < 0) {
                unitPrice = discountPrice;
            }
            itemDTO.setUnitPrice(unitPrice);
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setRequiresPrescription(item.getMedicine().isRequiresPrescription());
            if (item.getPrescription() != null) {
                itemDTO.setPrescriptionId(item.getPrescription().getId());
                itemDTO.setPrescriptionStatus(item.getPrescription().getStatus().name());
            }
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(items);

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalAmount(total);

        // Apply coupon discount, if any
        BigDecimal discount = BigDecimal.ZERO;
        String couponCode = cart.getAppliedCouponCode();
        if (couponCode != null && !items.isEmpty()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(couponCode);
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                BigDecimal minOrder = coupon.getMinOrderAmount() != null ? coupon.getMinOrderAmount() : BigDecimal.ZERO;
                boolean valid = coupon.isActive()
                        && (coupon.getExpiryDate() == null || !coupon.getExpiryDate().isBefore(LocalDate.now()))
                        && total.compareTo(minOrder) >= 0;
                if (valid) {
                    discount = calculateDiscount(total, coupon);
                    dto.setAppliedCouponCode(coupon.getCode().toUpperCase());
                    dto.setCouponMessage("Coupon \"" + coupon.getCode().toUpperCase() + "\" applied.");
                } else {
                    // Coupon no longer valid (e.g. cart total dropped below minimum) — clear it silently
                    cart.setAppliedCouponCode(null);
                    cartRepository.save(cart);
                }
            } else {
                cart.setAppliedCouponCode(null);
                cartRepository.save(cart);
            }
        }
        if (items.isEmpty() && couponCode != null) {
            // Cart emptied — clear stale coupon
            cart.setAppliedCouponCode(null);
            cartRepository.save(cart);
        }

        dto.setDiscountAmount(discount);
        dto.setGrandTotal(total.subtract(discount));

        return dto;
    }

    private CartDTO emptyCart() {
        CartDTO dto = new CartDTO();
        dto.setItems(List.of());
        dto.setTotalAmount(BigDecimal.ZERO);
        dto.setDiscountAmount(BigDecimal.ZERO);
        dto.setGrandTotal(BigDecimal.ZERO);
        return dto;
    }
}
