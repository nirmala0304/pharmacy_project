package com.pharmacy.controller;

import com.pharmacy.entity.Coupon;
import com.pharmacy.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coupons")
public class PublicCouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        List<Coupon> activeCoupons = couponRepository.findByActiveTrue().stream()
                .filter(c -> c.getExpiryDate() == null || !c.getExpiryDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(activeCoupons);
    }
}
