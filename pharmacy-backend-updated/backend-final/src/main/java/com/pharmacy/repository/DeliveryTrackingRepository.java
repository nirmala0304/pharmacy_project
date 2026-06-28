package com.pharmacy.repository;

import com.pharmacy.entity.DeliveryTracking;
import com.pharmacy.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {

    Optional<DeliveryTracking> findByOrderId(Long orderId);

    Optional<DeliveryTracking> findByOrder(Order order);
}
