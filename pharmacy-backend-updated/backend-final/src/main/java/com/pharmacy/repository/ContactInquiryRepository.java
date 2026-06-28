package com.pharmacy.repository;

import com.pharmacy.entity.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {

    List<ContactInquiry> findAllByOrderByCreatedAtDesc();

    List<ContactInquiry> findByStatusOrderByCreatedAtDesc(ContactInquiry.Status status);

    List<ContactInquiry> findByPreferCallbackTrueAndStatusNotOrderByCreatedAtDesc(ContactInquiry.Status status);

    List<ContactInquiry> findByUrgencyAndStatusOrderByCreatedAtDesc(
        ContactInquiry.Urgency urgency, ContactInquiry.Status status);

    List<ContactInquiry> findByUserIdOrderByCreatedAtDesc(Long userId);
}
