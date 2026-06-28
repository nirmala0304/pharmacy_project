package com.pharmacy.controller;

import com.pharmacy.dto.ContactInquiryDTO;
import com.pharmacy.dto.MedicineInquiryDTO;
import com.pharmacy.service.ContactInquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactInquiryService service;

    // ════════════════════════════════════
    //  PUBLIC — anyone can submit
    // ════════════════════════════════════

    /** POST /api/contact/inquiries — submit a general contact message */
    @PostMapping("/inquiries")
    public ResponseEntity<ContactInquiryDTO> submitContactInquiry(@RequestBody Map<String, Object> body) {
        ContactInquiryDTO dto = service.createContactInquiry(body);
        return ResponseEntity.ok(dto);
    }

    /** POST /api/contact/medicine-inquiries — submit a medicine availability request */
    @PostMapping("/medicine-inquiries")
    public ResponseEntity<MedicineInquiryDTO> submitMedicineInquiry(@RequestBody Map<String, Object> body) {
        MedicineInquiryDTO dto = service.createMedicineInquiry(body);
        return ResponseEntity.ok(dto);
    }

    // ════════════════════════════════════
    //  PHARMACIST / ADMIN — manage inquiries
    // ════════════════════════════════════

    /** GET /api/contact/inquiries — all contact inquiries */
    @GetMapping("/inquiries")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<List<ContactInquiryDTO>> getAllContactInquiries() {
        return ResponseEntity.ok(service.getAllContactInquiries());
    }

    /** GET /api/contact/medicine-inquiries — all medicine inquiries */
    @GetMapping("/medicine-inquiries")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<List<MedicineInquiryDTO>> getAllMedicineInquiries() {
        return ResponseEntity.ok(service.getAllMedicineInquiries());
    }

    /** GET /api/contact/stats — dashboard stat counts */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getInquiryStats());
    }

    // ── Contact inquiry updates ──

    /** PUT /api/contact/inquiries/{id}/status */
    @PutMapping("/inquiries/{id}/status")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<ContactInquiryDTO> updateContactStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateContactStatus(id, body.get("status")));
    }

    /** PUT /api/contact/inquiries/{id}/note */
    @PutMapping("/inquiries/{id}/note")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<ContactInquiryDTO> updateContactNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateContactNote(id, body.get("note")));
    }

    // ── Medicine inquiry updates ──

    /** PUT /api/contact/medicine-inquiries/{id}/status */
    @PutMapping("/medicine-inquiries/{id}/status")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<MedicineInquiryDTO> updateMedicineStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateMedicineStatus(id, body.get("status")));
    }

    /** PUT /api/contact/medicine-inquiries/{id}/note */
    @PutMapping("/medicine-inquiries/{id}/note")
    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    public ResponseEntity<MedicineInquiryDTO> updateMedicineNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateMedicineNote(id, body.get("note")));
    }
}
