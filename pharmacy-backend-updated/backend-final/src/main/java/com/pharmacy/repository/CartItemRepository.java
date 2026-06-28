package com.pharmacy.repository;

import com.pharmacy.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndMedicineId(Long cartId, Long medicineId);
    void deleteByCartId(Long cartId);
}
