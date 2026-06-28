package com.pharmacy.repository;

import com.pharmacy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByPlacedAtDesc(Long userId);
    Optional<Order> findByTrackingNumber(String trackingNumber);
    List<Order> findByStatus(Order.OrderStatus status);
}
