package com.pharmacy.repository;

import com.pharmacy.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    java.util.List<Coupon> findByActiveTrue();
}
