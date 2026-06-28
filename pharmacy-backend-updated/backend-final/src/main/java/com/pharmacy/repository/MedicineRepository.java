package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByIsActiveTrue();

    List<Medicine> findByCategoryIdAndIsActiveTrue(Long categoryId);

    @Query("SELECT m FROM Medicine m WHERE m.isActive = true AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Medicine> searchMedicines(@Param("keyword") String keyword);

    @Query("SELECT m FROM Medicine m WHERE m.isActive = true AND m.stockQuantity <= m.minStockLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT m FROM Medicine m WHERE m.isActive = true AND m.expiryDate <= :date")
    List<Medicine> findExpiringMedicines(@Param("date") LocalDate date);

    List<Medicine> findByBrandContainingIgnoreCaseAndIsActiveTrue(String brand);

    @Query("SELECT m FROM Medicine m WHERE m.isActive = true AND m.category.id = :categoryId AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Medicine> searchMedicinesInCategory(@Param("keyword") String keyword, @Param("categoryId") Long categoryId);
}
