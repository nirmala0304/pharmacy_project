package com.pharmacy.controller;

import com.pharmacy.entity.Coupon;
import com.pharmacy.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    // GET all coupons — ADMIN / PHARMACIST
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    // POST create coupon — ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Map<String, Object> body) {
        Coupon coupon = new Coupon();
        coupon.setCode(body.get("code").toString().trim().toUpperCase());
        coupon.setDiscountType(Coupon.DiscountType.valueOf(body.get("discountType").toString()));
        coupon.setDiscountValue(new BigDecimal(body.get("discountValue").toString()));
        if (body.get("minOrderAmount") != null)
            coupon.setMinOrderAmount(new BigDecimal(body.get("minOrderAmount").toString()));
        if (body.get("maxDiscountAmount") != null && !body.get("maxDiscountAmount").toString().isBlank())
            coupon.setMaxDiscountAmount(new BigDecimal(body.get("maxDiscountAmount").toString()));
        if (body.get("expiryDate") != null && !body.get("expiryDate").toString().isBlank())
            coupon.setExpiryDate(LocalDate.parse(body.get("expiryDate").toString()));
        coupon.setDescription(body.getOrDefault("description", "").toString());
        coupon.setActive(true);
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    // PUT update coupon — ADMIN only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        if (body.get("discountValue") != null)
            coupon.setDiscountValue(new BigDecimal(body.get("discountValue").toString()));
        if (body.get("minOrderAmount") != null)
            coupon.setMinOrderAmount(new BigDecimal(body.get("minOrderAmount").toString()));
        if (body.containsKey("maxDiscountAmount")) {
            String v = body.get("maxDiscountAmount") == null ? "" : body.get("maxDiscountAmount").toString();
            coupon.setMaxDiscountAmount(v.isBlank() ? null : new BigDecimal(v));
        }
        if (body.get("expiryDate") != null) {
            String d = body.get("expiryDate").toString();
            coupon.setExpiryDate(d.isBlank() ? null : LocalDate.parse(d));
        }
        if (body.get("description") != null)
            coupon.setDescription(body.get("description").toString());
        if (body.get("active") != null)
            coupon.setActive(Boolean.parseBoolean(body.get("active").toString()));
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    // DELETE coupon — ADMIN only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // PATCH toggle active — ADMIN only
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Coupon> toggleCoupon(@PathVariable Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setActive(!coupon.isActive());
        return ResponseEntity.ok(couponRepository.save(coupon));
    }
}
