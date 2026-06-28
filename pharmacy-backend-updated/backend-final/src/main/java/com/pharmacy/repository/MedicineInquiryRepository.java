package com.pharmacy.repository;

import com.pharmacy.entity.MedicineInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineInquiryRepository extends JpaRepository<MedicineInquiry, Long> {

    List<MedicineInquiry> findAllByOrderByCreatedAtDesc();

    List<MedicineInquiry> findByStatusOrderByCreatedAtDesc(MedicineInquiry.Status status);

    List<MedicineInquiry> findByRequestCallbackTrueAndStatusNotOrderByCreatedAtDesc(MedicineInquiry.Status status);

    List<MedicineInquiry> findByUrgencyAndStatusOrderByCreatedAtDesc(
        MedicineInquiry.Urgency urgency, MedicineInquiry.Status status);

    List<MedicineInquiry> findByUserIdOrderByCreatedAtDesc(Long userId);
}
